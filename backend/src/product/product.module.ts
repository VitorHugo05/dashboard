import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    forwardRef(() => CategoryModule),
    S3Module
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, MongooseModule]
})
export class ProductModule {}
