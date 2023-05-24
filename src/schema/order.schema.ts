import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderHistoryDocument = OrderHistory & Document;

@Schema()
export class OrderHistory {
  @Prop({ required: true })
  customer: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [
      {
        createDate: { type: Date },
        orderId: { type: String },
        status: { type: String },
        totalPrice: { type: Number },
      },
    ],
  })
  history: {
    createDate: Date;
    orderId: string;
    status: string;
    totalPrice: number;
  }[];
}
export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);
