import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginInput {
  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Password',
    example: '12345678',
  })
  @IsStrongPassword()
  password: string;
}
