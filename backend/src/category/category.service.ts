import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save()
  }

  async findAll() {
    const categorys = await this.categoryModel.find().sort({ updateAt: -1 }).exec();
    return categorys;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryModel.findById(id).exec()
    if (!category) {
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND)
    }
    return category;
  }

  async addProductToCategories(productId: string, categoryIds: string[]): Promise<void> {
    await this.categoryModel.updateMany(
      { _id: { $in: categoryIds } },
      { $addToSet: { products: productId } }
    );
  }
}
