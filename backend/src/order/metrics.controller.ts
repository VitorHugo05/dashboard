import { Controller, Get, HttpException, HttpStatus, Query } from "@nestjs/common";
import { OrderService } from "./order.service";

interface ResponseType<T> {
  statusCode: HttpStatus,
  data?: T,
}

interface Metrics {
  totalOrders: number,
  totalRevenue: number,
  averageOrderValue: number
}

@Controller('metrics')
export class MetricsController {
    constructor(
        private readonly orderService: OrderService
      ) { }

    @Get()
    async metrics() {
      try {
        const data = await this.orderService.metrics();
  
        return {
          statusCode: HttpStatus.OK,
          data,
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
}