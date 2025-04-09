import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

interface ResponseType<T> {
  statusCode: HttpStatus,
  data?: T,
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<ResponseType<Order>> {
    try {
      const res = await this.orderService.create(createOrderDto);

      return {
        statusCode: HttpStatus.CREATED,
        data: res,
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<ResponseType<Order[]>> {
    try {
      const res = await this.orderService.findAll();

      return {
        statusCode: HttpStatus.OK,
        data: res,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseType<Order>> {
    try {
      const res = await this.orderService.findById(id);

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

  @Put(':id')
  async update(
    @Body() createOrderDto: Partial<CreateOrderDto>,
    @Param('id') id: string
  ): Promise<ResponseType<Order>> {
    try {
      const res = await this.orderService.update(id, createOrderDto)

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
  async remove(@Param('id') id: string): Promise<ResponseType<Order>> {
    try {
      await this.orderService.delete(id);
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
