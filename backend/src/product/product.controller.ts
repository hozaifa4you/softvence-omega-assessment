import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { RoleEnum, type AuthUserType } from 'src/types/auth';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtGuard)
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   @Post()
   @HttpCode(HttpStatus.CREATED)
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.vendor)
   public async create(
      @Body() createProductDto: CreateProductDto,
      @AuthUser() user: AuthUserType,
   ) {
      return this.productService.create(user.id, createProductDto);
   }
}
