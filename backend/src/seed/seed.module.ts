import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { OrderModule } from '../order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        ProductModule,
        CategoryModule,
        OrderModule
    ],
    providers: [SeedService],
    exports: [SeedService]
})

export class SeedModule {}
