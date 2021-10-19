import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';

interface Configs {
  _id: string;
  dbVersion: number;
}

export const CONFIGS_MODEL = 'CONFIGS_MODEL';

export const ConfigsSchema = new mongoose.Schema({ _id: String }, { strict: false, collection: '_configs' });

export type ConfigsDocument = Configs & Document;

export const configsModelProvider = {
  provide: CONFIGS_MODEL,
  useFactory: (connection: Connection) => connection.model('Configs', ConfigsSchema),
  inject: ['MONGO_CONNECTION']
};