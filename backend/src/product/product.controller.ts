import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('data') createProductDtoReq: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    
      const createProductDto: CreateProductDto = JSON.parse(createProductDtoReq);
      const res = await this.productService.create(createProductDto, file);
      return {
        statusCode: HttpStatus.CREATED,
        product: res,
      }
    
  }

  @Get()
  async findAll() {
    try {
      const res = await this.productService.findAll();

      return {
        statusCode: HttpStatus.OK,
        products: res
      }
    } catch (err) {
      
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const res = await this.productService.findById(id);

      return {
        statusCode: HttpStatus.OK,
        product: res
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try{
      const res = await this.productService.update(id, updateProductDto)

      return {
        statusCode: HttpStatus.OK,
        product: res
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.productService.delete(id);

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
