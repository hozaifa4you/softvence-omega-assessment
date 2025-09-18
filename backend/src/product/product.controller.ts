import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   ParseIntPipe,
   Post,
   Put,
   UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { RoleEnum } from 'src/types/auth';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthorGuard } from './guards/author.guard';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   @Post()
   @HttpCode(HttpStatus.CREATED)
   @UseGuards(JwtGuard, RolesGuard)
   @Roles(RoleEnum.vendor)
   public async create(@Body() createProductDto: CreateProductDto) {
      return this.productService.create(createProductDto);
   }

   @Get()
   @HttpCode(HttpStatus.OK)
   public async findAll() {
      return this.productService.findAll();
   }

   @Get('vendors/:vendorId')
   @HttpCode(HttpStatus.OK)
   public async findProductByVendor(
      @Param('vendorId', ParseIntPipe) vendorId: number,
   ) {
      return this.productService.findProductsByVendor(vendorId);
   }

   @Get(':slug')
   @HttpCode(HttpStatus.OK)
   public async findOne(@Param('slug') slug: string) {
      return this.productService.findOne(slug);
   }

   @Put(':slug')
   @HttpCode(HttpStatus.OK)
   @UseGuards(JwtGuard, AuthorGuard)
   public async update(
      @Body() updateProductDto: UpdateProductDto,
      @Param('slug') slug: string,
   ) {
      return this.productService.update(slug, updateProductDto);
   }

   @Delete(':slug')
   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(JwtGuard, AuthorGuard)
   public async delete(@Param('slug') slug: string) {
      return this.productService.delete(slug);
   }
}
