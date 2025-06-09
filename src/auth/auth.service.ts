import { generatePassword } from '@/lib/generate-password';
import { CreateUserInput } from '@/types-generated/user/dto/create-user.dto';
import { ErrorCodes } from '@/lib/types/error-codes.enum';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.dto';
// argon2 is recommended by OSWASP
import { argon2 } from '@/lib/argon';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(input: CreateUserInput) {
    const user = await this.userService.getUserByEmail(input.email);
    if (user) {
      throw new BadRequestException(ErrorCodes.USER_ALREADY_EXISTS);
    }

    const newUser = await this.userService.createUser(input);

    return this.issueTokens(newUser.id, {
      email: newUser.email,
    });
  }

  async login(data: LoginInput) {
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException(ErrorCodes.USER_NOT_FOUND);
    }

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) {
      throw new BadRequestException(ErrorCodes.PASSWORD_INCORRECT);
    }

    return this.issueTokens(user.id, {
      email: user.email,
    });
  }

  async sso(input: CreateUserInput) {
    let user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      user = await this.userService.createUser({
        email: input.email,
        fullName: input.fullName,
        // avatar: input.avatar,
        phone: input.phone,
        password: await generatePassword({ length: 12, hash: false }),
      });
    }

    return this.issueTokens(user.id, {
      email: user.email,
    });
  }

  async logout(userId: number) {
    await this.userService.updateUserRefreshToken(userId, null);
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.getUserWithRefreshToken(
      userId,
      await argon2.hash(refreshToken),
    );
    if (!user) {
      throw new BadRequestException(ErrorCodes.REFRESH_TOKEN_INVALID);
    }

    return this.issueTokens(user.id, {
      email: user.email,
    });
  }

  private async issueTokens(userId: number, payload: { email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId, ...payload },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        { id: userId, ...payload },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    const userUpdated = await this.userService.updateUserRefreshToken(
      userId,
      hashedRefreshToken,
    );
    userUpdated.password = '';
    userUpdated.refreshToken = null;

    return { accessToken, refreshToken, user: userUpdated };
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<{ sub: number }>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      return await this.jwtService
        .verifyAsync(token, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        })
        .catch(() => false as const);
    }
  }
}
