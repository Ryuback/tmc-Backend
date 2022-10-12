import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { apiEnv } from '../../enviroments/api-env';
import { userModelProvider } from './model/user.mongo';
import { configsModelProvider } from '../../models/config.mongo';
import { classModelProvider } from './model/class.mongo';
import { taskGroupModelProvider } from './model/task-group.mongo';

export const databaseProvider = {
  provide: 'MONGO_CONNECTION',
  useFactory: (): Promise<typeof mongoose> => {
    const [part1, host] = apiEnv.mongoUrl.split('@');
    const [schema, user] = part1.split(':');
    return mongoose.connect(apiEnv.mongoUrl, {
      // @ts-ignore
      useNewUrlParser: true,
      autoIndex: false,
      // poolSize: 10,
      // autoReconnect: true,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      useUnifiedTopology: true,
    });
  },
};

const providers = [
  databaseProvider,
  configsModelProvider,
  userModelProvider,
  classModelProvider,
  taskGroupModelProvider
];

@Module({
  providers: providers,
  exports: providers,
})
export class DatabaseModule {}
