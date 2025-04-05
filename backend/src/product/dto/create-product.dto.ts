import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    price: number;

    @IsMongoId({ each: true })
    @IsNotEmpty()
    @IsArray()
    categoryIds: string[];

    @IsString()
    @IsNotEmpty()
    imageUrl: string;
}
