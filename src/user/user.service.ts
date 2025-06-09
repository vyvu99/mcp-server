import { argon2 } from '@/lib/argon';
import { CreateUserInput } from '@/types-generated/user/dto/create-user.dto';
import { UpdateUserInput } from '@/types-generated/user/dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(input: CreateUserInput) {
    return this.prismaService.user.create({
      data: {
        ...input,
        password: await argon2.hash(input.password),
      },
    });
  }

  async updateUser(userId: number, input: UpdateUserInput) {
    const data = { ...input };
    if (data.password) data.password = await argon2.hash(data.password);

    return this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateUserRefreshToken(userId: number, refreshToken: string | null) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async _updateUser(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(args);
  }

  async deleteUser(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }

  getUserById(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  getUserByIdAndEmailWithRole(id: number, email: string) {
    return this.prismaService.user.findUnique({
      where: { id, email },
    });
  }

  getUserWithRole(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  getUserWithRefreshToken(id: number, refreshToken: string) {
    return this.prismaService.user.findUnique({
      where: { id, refreshToken },
    });
  }

  getAdminUser() {
    return this.prismaService.user.findFirst({ where: { isAdmin: true } });
  }

  // async requestResetPassword(user: UserInput) {
  //   const token = await this.prismaService.resetPasswordToken.findUnique({
  //     where: { email: user.email, phone: user.phone },
  //   });
  //   if (!token) {
  //     const code = nanoid(12);
  //     await this.prismaService.resetPasswordToken.create({
  //       data: {
  //         email: user.email,
  //         phone: user.phone,
  //         code,
  //         userId: user.id,
  //       },
  //     });

  //     if (user.email)
  //       await this.mailService.sendEmailResetPassword(user.email, code);

  //     return code;
  //   }

  //   // Allow to regenerate code every 1 minutes
  //   if (token.updatedAt.getTime() + 1 * 60 * 1000 <= Date.now()) {
  //     const code = nanoid(12);
  //     await this.prismaService.resetPasswordToken.update({
  //       where: { id: token.id },
  //       data: {
  //         code,
  //       },
  //     });

  //     if (user.email)
  //       await this.mailService.sendEmailResetPassword(user.email, code);

  //     return code;
  //   }
  // }

  // async changePasswordWithCode(input: ChangePasswordWithCodeInput) {
  //   const resetPasswordToken =
  //     await this.prismaService.resetPasswordToken.findUnique({
  //       where: {
  //         email: input.email,
  //         code: input.code,
  //       },
  //     });

  //   if (resetPasswordToken) {
  //     const [, updatedUser] = await Promise.all([
  //       this.prismaService.resetPasswordToken.delete({
  //         where: { id: resetPasswordToken.id },
  //       }),
  //       this.prismaService.user.update({
  //         where: { id: resetPasswordToken.userId },
  //         data: {
  //           password: await argon2.hash(input.password),
  //         },
  //       }),
  //     ]);

  //     return updatedUser;
  //   }
  // }
}
