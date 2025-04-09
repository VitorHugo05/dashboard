import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    createdAt: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    products: Types.ObjectId[]
}

export const categorySchema = SchemaFactory.createForClass(Category);
