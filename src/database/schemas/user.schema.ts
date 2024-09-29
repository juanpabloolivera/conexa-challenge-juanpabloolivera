import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RolesEnum } from '../../core/enum/roles.enum';

@Schema({
  collection: 'User',
  versionKey: false,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: RolesEnum })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
