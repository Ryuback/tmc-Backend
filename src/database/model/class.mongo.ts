import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { Class } from '../../../models/class.model';

export const CLASS_MODEL = 'CLASS_MODEL';

export const ClassSchema = new mongoose.Schema(
  { _id: String },
  { strict: false, collection: 'class' },
);

export type ClassDocument = Class & Document;

export const classModelProvider = {
  provide: CLASS_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('class', ClassSchema),
  inject: ['MONGO_CONNECTION'],
};
