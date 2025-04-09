import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from './entities/product.entity';

interface ResponseType<T> {
  statusCode: HttpStatus,
  data?: T,
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('data') createProductDtoReq: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseType<Product>> {
    
      const createProductDto: CreateProductDto = JSON.parse(createProductDtoReq);
      const res = await this.productService.create(createProductDto, file);
      return {
        statusCode: HttpStatus.CREATED,
        data: res,
      }
    
  }

  @Get()
  async findAll(): Promise<ResponseType<Product[]>> {
    try {
      const res = await this.productService.findAll();

      return {
        statusCode: HttpStatus.OK,
        data: res
      }
    } catch (err) {
      
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseType<Product>> {
    try {
      const res = await this.productService.findById(id);

      if (!res) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: res
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string, 
    @Body('data') updateProductDtoString: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseType<Product>> {
    try{
      const updateProductDto: UpdateProductDto = JSON.parse(updateProductDtoString);
      const res = await this.productService.update(id, updateProductDto, file)

      if (!res) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: res
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseType<Product>> {
    try {
      await this.productService.delete(id);
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
