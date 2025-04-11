import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import axios from 'axios'

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
    try {
      const lambdaEndpoint = 'http://host.docker.internal:3001/dev/order';
      const payload = {
        orderId: createdOrder._id,
        total: createdOrder.total,
      };

      await axios.post(lambdaEndpoint, payload);
    } catch (error) {
      console.error('Erro ao invocar a função de notificação:', error.message);
    }
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

  async metrics() {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          averageOrderValue: { $avg: "$total" }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          averageOrderValue: 1
        }
      }
    ]);

    const ordersByPeriod = await this.orderModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            week: { $dateToString: { format: "%Y-W%U", date: "$date" } },
            month: { $dateToString: { format: "%Y-%m", date: "$date" } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          daily: { $push: { k: "$_id.day", v: "$count" } },
          weekly: { $push: { k: "$_id.week", v: "$count" } },
          monthly: { $push: { k: "$_id.month", v: "$count" } }
        }
      },
      {
        $project: {
          _id: 0,
          daily: { $arrayToObject: "$daily" },
          weekly: { $arrayToObject: "$weekly" },
          monthly: { $arrayToObject: "$monthly" }
        }
      }
    ]);

    return {
      totalOrders: result[0]?.totalOrders || 0,
      totalRevenue: result[0]?.totalRevenue || 0,
      averageOrderValue: result[0]?.averageOrderValue || 0,
      ordersByPeriod: ordersByPeriod[0] || { daily: {}, weekly: {}, monthly: {} }
    };
  }

  async update(id: string, createOrderDto: Partial<CreateOrderDto>) {
    const updateData: any = { ...createOrderDto };

    await this.findById(id);
    const order = await this.orderModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return order;
  }

  async delete(id: string) {
    const order = await this.orderModel.findById(id).exec()
    if (!order) {
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND)
    }
    await this.orderModel.findByIdAndDelete(id).exec();
  }
}
