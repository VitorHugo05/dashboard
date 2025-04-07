import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly productService: ProductService
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const products = await this.productService.findManyByIds(createOrderDto.productIds);

    const duplicates = createOrderDto.productIds.filter((id, i, arr) => arr.indexOf(id) !== i);
    if (duplicates.length > 0) {
      throw new HttpException(`Duplicate product IDs: ${[...new Set(duplicates)]}`, HttpStatus.BAD_REQUEST);
    }

    if (products.length !== createOrderDto.productIds.length) {
      throw new HttpException('Some products not found', HttpStatus.BAD_REQUEST);
    }

    const total = products.reduce((acc, product) => acc + product.price, 0);

    const order = new this.orderModel({
      ...createOrderDto,
      total,
      date: new Date()
    });

    const createdOrder = await order.save()

    const lambda = new LambdaClient({
      region: 'us-east-1'
    });
  
    const command = new InvokeCommand({
      FunctionName: 'processNewOrder',
      InvocationType: 'Event', 
      Payload: JSON.stringify(createOrderDto)
    });
  
    await lambda.send(command);

    return createdOrder;
  }

  async findAll() {
    const orders = await this.orderModel.find().sort({ updateAt: -1 }).exec();
    return orders;
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND)
    }
    return order
  }

  async generateMetric(
    startDate?: Date,
    endDate?: Date,
    productId?: string,
    categoryId?: string
  ) {
    const metrics = await this.orderModel.aggregate([
      {
        $match: {
          ...(startDate && { date: { $gte: startDate } }),
          ...(endDate && { date: { $lte: endDate } }),
          ...(productId && { productIds: productId }),
          ...(categoryId && { categoryIds: categoryId })
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: { $round: ['$averageOrderValue', 2] }
        }
      }
    ]);
  
    return metrics.length > 0 ? metrics[0] : {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };
  }
}
