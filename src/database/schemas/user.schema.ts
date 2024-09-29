import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RolesEnum } from '../../core/enum/roles.enum';

@Schema({
  collection: 'User',
  versionKey: false,
})
export class User extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ enum: RolesEnum, required: true, type: String })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
