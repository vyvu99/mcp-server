import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UserInput {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  id: number;
  @ApiProperty({
    type: 'string',
  })
  fullName: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  phone: string | null;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'boolean',
    nullable: true,
  })
  isAdmin: boolean | null;
  @ApiHideProperty()
  refreshToken: string | null;
}
