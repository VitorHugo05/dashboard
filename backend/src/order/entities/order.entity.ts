import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
    @Prop()
    id: string;

    @Prop({type: Date})
    date: Date;

    @Prop({ type: [Types.ObjectId], ref: 'Product' })
    productIds: Types.ObjectId[];

    @Prop()
    total: number;
}

const orderSchema = SchemaFactory.createForClass(Order);
