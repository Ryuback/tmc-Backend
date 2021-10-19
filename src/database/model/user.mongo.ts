import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { User } from '../../../models/user.model';

export const USER_MODEL = 'USER_MODEL';

export const UserSchema = new mongoose.Schema({ _id: String }, { strict: false, collection: 'users' });

export type UserDocument = User & Document;

export const userModelProvider = {
  provide: USER_MODEL,
  useFactory: (connection: Connection) => connection.model('User', UserSchema),
  inject: ['MONGO_CONNECTION']
};