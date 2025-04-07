import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './entities/order.entity';
import { ProductModule } from '../product/product.module';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    ProductModule
  ],
  controllers: [OrderController, MetricsController],
  providers: [OrderService],
  exports: [MongooseModule]
})
export class OrderModule {}
