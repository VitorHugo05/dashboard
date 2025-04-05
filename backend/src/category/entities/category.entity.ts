import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    product: Types.ObjectId[]
}

const categorySchema = SchemaFactory.createForClass(Category);
