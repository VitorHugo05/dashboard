import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

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
        message: 'Product created'
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
}
