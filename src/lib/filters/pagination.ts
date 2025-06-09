import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsPositive()
  @IsInt()
  limit: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  page: number;
}

export class PaginationDtoResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;
}
