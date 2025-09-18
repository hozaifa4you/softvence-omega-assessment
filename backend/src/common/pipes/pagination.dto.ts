import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationDto {
   @IsOptional()
   @Transform(({ value }) => parseInt(value, 10))
   @IsInt()
   @IsPositive()
   page?: number = 1;

   @IsOptional()
   @Transform(({ value }) => parseInt(value, 10))
   @IsInt()
   @IsPositive()
   @Max(100)
   pageSize?: number = 10;

   get skip(): number {
      return (this.page! - 1) * this.pageSize!;
   }

   get take(): number {
      return this.pageSize!;
   }
}
