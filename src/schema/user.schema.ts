import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';

export type UsersDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  orderRef: MongooseSchema.Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);
