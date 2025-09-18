import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Param,
   ParseIntPipe,
   Post,
   Put,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/types/auth';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('categories')
@UseGuards(JwtGuard)
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   @Post()
   @HttpCode(HttpStatus.CREATED)
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.admin)
   public async create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoryService.create(createCategoryDto);
   }

   @Put(':id')
   @HttpCode(HttpStatus.CREATED)
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.admin)
   public async update(
      @Body() updateCategoryDto: CreateCategoryDto,
      @Param('id', ParseIntPipe) id: number,
   ) {
      return this.categoryService.update(id, updateCategoryDto);
   }
}
