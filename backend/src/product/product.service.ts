import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, Types } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { S3Service } from '../s3/s3.service'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService,
    private readonly s3Service: S3Service
  ) { }

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    for (const item of createProductDto.categoryIds) {
      const category = await this.categoryService.findById(item)
      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }
    }

    const image = await this.s3Service.upload(file)
    const createdProduct = new this.productModel(createProductDto);
    createdProduct.imageUrl = image;
    createdProduct.createdAt = new Date()
    const savedProduct = await createdProduct.save();

    await this.categoryService.addProductToCategories(
      savedProduct._id.toString(),
      createProductDto.categoryIds
    );

    return savedProduct;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
    return product
  }

  async findAll() {
    const products = await this.productModel.find().sort({ updatedAt: -1 }).exec();
    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto, file: Express.Multer.File) {
    const updateData: any = { ...updateProductDto };

    if (file) {
      updateData.imageUrl = await this.s3Service.upload(file);
    }

    await this.findById(id);
    const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return product;
  }

  async delete(id: string) {
    const product = await this.productModel.findById(id).exec()
    if (!product) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND)
    }
    if (product.categoryIds && product.categoryIds.length > 0) {
      await this.categoryService.removeProductFromCategories(id, product.categoryIds);
    }
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async findManyByIds(ids: string[]) {
    return this.productModel.find({ _id: { $in: ids } }).exec();
  }

  async removeCategoryFromProducts(categoryId: string, productIds: string[]) {
    await this.productModel.updateMany(
      { _id: { $in: productIds } },
      { $pull: { categoryIds: categoryId } }
    ).exec();
  }
}
