import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { SeedModule } from 'src/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ProductModule, 
    CategoryModule, 
    OrderModule,
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    S3Module,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
