import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const res = await this.productService.create(createProductDto);
      return {
        statusCode: HttpStatus.CREATED,
        product: res,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
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
