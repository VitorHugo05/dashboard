import { Controller, Get, Post, Body, HttpStatus, HttpException, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categorys')
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) { }

   @Post()
   async create(@Body() createCategoryDto: CreateCategoryDto) {
      try {
         const res = await this.categoryService.create(createCategoryDto);

         return {
            statusCode: HttpStatus.CREATED,
            category: res,
            message: 'Category created'
         }
      } catch (err) {
         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }

   @Get()
   async findAll() {
      try {
         const res = await this.categoryService.findAll()

         return {
            statusCode: HttpStatus.OK,
            categories: res,
         }
      } catch (err) {
         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }

   @Get(':id')
   async findById(@Param('id') id: string) {
      try {
         const res = await this.categoryService.findById(id)

         return {
            statusCode: HttpStatus.OK,
            category: res,
         }
      } catch (err) {
         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }
}
