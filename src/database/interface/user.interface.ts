import { Types } from 'mongoose';
import { RolesEnum } from '../../core/enum/roles.enum';
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: RolesEnum;
}
