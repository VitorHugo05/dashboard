import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
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
    async metrics(
      @Query('startDate') startDate?: string,
      @Query('endDate') endDate?: string,
      @Query('productId') productId?: string,
      @Query('categoryId') categoryId?: string,
    ): Promise<ResponseType<Metrics>> {
      const res: Metrics = await this.orderService.generateMetric(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
        productId,
        categoryId,
      );
  
      return {
        statusCode: HttpStatus.OK,
        data: res,
      };
    }
}