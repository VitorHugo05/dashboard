import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
    categoryIds: Types.ObjectId[];

    @Prop()
    imageUrl: string;

    @Prop()
    createdAt: Date;
}

export const productSchema = SchemaFactory.createForClass(Product);
