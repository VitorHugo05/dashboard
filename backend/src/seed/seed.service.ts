import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/entities/category.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { fakerPT_BR as faker } from '@faker-js/faker';

@Injectable()
export class SeedService {
    
    constructor(
        @InjectModel(Product.name) private productSchema: Model<Product>,
        @InjectModel(Order.name) private orderSchema: Model<Order>,
        @InjectModel(Category.name) private categorySchema: Model<Category>,
    ) { }

    async cleanDatabase() {
        await this.productSchema.deleteMany({});
        await this.orderSchema.deleteMany({});
        await this.categorySchema.deleteMany({});
    }

    async seed(categoriesQuantity: number, productsQuantity: number, ordersQuantity: number) {
        await this.seedCategories(categoriesQuantity);
        await this.seedProducts(productsQuantity);
        await this.seedOrders(ordersQuantity);
    }

    async seedCategories(quantity: number) {
        const categories: Category[] = []
        for (var i = 0; i < quantity; i++) {
            const fakeCategory = new Category();
            fakeCategory.name = faker.commerce.department();
            categories.push(fakeCategory);
        }
        return this.categorySchema.insertMany(categories);
    }

    async seedProducts(quantity: number) {
        const products: Product[] = [];
        const categories = await this.categorySchema.find()
        for (var i = 0; i < quantity; i++) {
            const fakeProduct = new Product();
            fakeProduct.description = faker.commerce.productDescription();
            fakeProduct.name = faker.commerce.productName();
            fakeProduct.price = faker.number.int({ min: 100, max: 3000 });
            const numberOfCategories = faker.number.int({ min: 1, max: 3 });
            const randomCategories = faker.helpers.arrayElements(categories, numberOfCategories);
            fakeProduct.categoryIds = randomCategories.map(category => category._id);
            fakeProduct.imageUrl = faker.image.urlPicsumPhotos({
                height: 200,
                width: 200
            })
            products.push(fakeProduct);
        }
        return this.productSchema.insertMany(products);
    }

    async seedOrders(quantity: number) {
        const orders: Order[] = [];
        const products = await this.productSchema.find();
        for (var i = 0; i < quantity; i++) {
            const fakeOrder = new Order();
            fakeOrder.date = faker.date.recent();
            const numberOfProducts = faker.number.int({ min: 1, max: products.length });
            const randomProducts = faker.helpers.arrayElements(products, numberOfProducts);
            fakeOrder.productIds = randomProducts.map(product => product._id);
            fakeOrder.total = randomProducts.reduce((sum, product) => sum + product.price, 0);
            orders.push(fakeOrder);
        }
        return this.orderSchema.insertMany(orders);
    }
}
