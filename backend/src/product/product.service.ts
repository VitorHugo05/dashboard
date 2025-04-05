import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, Types } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject(forwardRef(() => CategoryService))private readonly categoryService: CategoryService
  ) { }

  async create(createProductDto: CreateProductDto) {
    for (const item of createProductDto.categoryIds) {
      const category = await this.categoryService.findById(item)
      if (!category) {
        throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
      }
    }

    const createdProduct = new this.productModel(createProductDto);
    const savedProduct = await createdProduct.save();

    await this.categoryService.addProductToCategories(
      savedProduct._id.toString(),
      createProductDto.categoryIds
    );

    return savedProduct;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).exec()
    if (!product) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND)
    }
    return product;
  }

  async findAll() {
    const products = await this.productModel.find().sort({ updateAt: -1 }).exec();
    return products
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updateData: any = { ...updateProductDto };
    await this.findById(id);
    const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return product;
  }

  async delete(id: string) {
    const product = await this.findById(id); 
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
