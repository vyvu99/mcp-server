import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class SortDto {
  @ApiProperty()
  field: string;

  @ApiProperty({ enum: Object.values(Prisma.SortOrder) })
  direction: Prisma.SortOrder;
}
