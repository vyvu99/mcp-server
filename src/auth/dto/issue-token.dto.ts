// import { User } from '@/types-generated/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class JwtPayload {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

export class IssueToken {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  // @ApiProperty({
  //   type: User,
  // })
  // user: User;
}
