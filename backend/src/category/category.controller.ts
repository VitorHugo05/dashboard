import { Controller, Get, Post, Body, HttpStatus, HttpException, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

interface ResponseType<T> {
   statusCode: HttpStatus,
   data?: T,
}

@Controller('categories')
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) { }

   @Post()
   async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseType<Category>> {
      try {
         const res = await this.categoryService.create(createCategoryDto);

         return {
            statusCode: HttpStatus.CREATED,
            data: res,
         }
      } catch (err) {
         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }

   @Get()
   async findAll(): Promise<ResponseType<Category[]>> {
      try {
         const res = await this.categoryService.findAll()

         return {
            statusCode: HttpStatus.OK,
            data: res,
         }
      } catch (err) {
         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }

   @Get(':id')
   async findById(@Param('id') id: string): Promise<ResponseType<Category>> {
      try {
         const res = await this.categoryService.findById(id)

         return {
            statusCode: HttpStatus.OK,
            data: res,
         }
      } catch (err) {
         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }

   @Put(':id')
   async update(
      @Param('id') id: string,
      @Body() updateCategoryDto: CreateCategoryDto
   ): Promise<ResponseType<Category>> {
      try {
         const res = await this.categoryService.update(id, updateCategoryDto)

         if (!res) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
         }

         return {
            statusCode: HttpStatus.OK,
            data: res,
         }
      } catch (err) {
         if (err instanceof HttpException) {
            throw err;
         }

         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }

   @Delete(':id')
   async delete(@Param('id') id: string): Promise<ResponseType<Category>> {
      try {
         await this.categoryService.delete(id)

         return {
            statusCode: HttpStatus.OK,
         }
      } catch (err) {
         if (err instanceof HttpException) {
            throw err;
         }

         throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
   }
}