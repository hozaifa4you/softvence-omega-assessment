import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { type VendorStatus } from '../../db/schemas';

export class CreateVendorDto {
   @IsString()
   @Length(5, 64)
   name: string;

   @IsOptional()
   @IsString()
   @Length(0, 255)
   description?: string;

   @IsOptional()
   @IsEnum(['active', 'closed', 'suspended'], {
      message:
         'Invalid vendor status. Must be one of: active, closed, suspended',
   })
   status?: VendorStatus;
}
