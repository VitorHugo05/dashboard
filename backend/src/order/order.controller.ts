import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const res = await this.orderService.create(createOrderDto);

      return {
        statusCode: HttpStatus.CREATED,
        order: res,
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const res = await this.orderService.findAll();

      return {
        statusCode: HttpStatus.OK,
        orders: res,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const res = await this.orderService.findById(id);

      return {
        statusCode: HttpStatus.OK,
        order: res,
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('metrics')
  async metrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('productId') productId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const res = await this.orderService.generateMetric(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      productId,
      categoryId,
    );

    return {
      statusCode: HttpStatus.OK,
      metrics: res,
    };
  }
}
