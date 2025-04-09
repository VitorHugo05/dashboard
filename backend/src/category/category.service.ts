import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model, Types } from 'mongoose';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @Inject(forwardRef(() => ProductService))private readonly productService: ProductService
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    createdCategory.createdAt = new Date()
    return createdCategory.save()
  }

  async findAll() {
    const categorys = await this.categoryModel.find().sort({ updateAt: -1 }).exec();
    return categorys;
  }

  async findById(id: string) {
    const category = await this.categoryModel.findById(id).exec()
    if (!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND)
    }
    return category;
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto) {
    const updateData: any = { ...updateCategoryDto };
    await this.findById(id);
    const category = await this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return category;
  }

  async addProductToCategories(productId: string, categoryIds: string[]): Promise<void> {
    await this.categoryModel.updateMany(
      { _id: { $in: categoryIds } },
      { $addToSet: { products: productId } }
    );
  }

  async removeProductFromCategories(productId: string, categoryIds: Types.ObjectId[]) {
    for (const categoryId of categoryIds) {
      await this.categoryModel.findByIdAndUpdate(
        categoryId,
        { $pull: { products: productId } }, 
        { new: true }
      ).exec();
    }
  }

  async delete(id: string) {
    const category = await this.findById(id);
    
    if (!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
    }
  
    if (category.products.length > 0) {
      const products = await this.productService.findManyByIds(
        category.products.map(prodId => prodId.toString())
      );
  
      const hasExclusiveLink = products.some(product => 
        product.categoryIds.length === 1
      );
  
      if (hasExclusiveLink) {
        throw new HttpException("Category still has products", HttpStatus.CONFLICT);
      }

      await this.productService.removeCategoryFromProducts(id, category.products.map(prodId => prodId.toString()));
    }
  
    await this.categoryModel.findByIdAndDelete(id).exec();
  }
  
}
