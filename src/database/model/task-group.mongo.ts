import { TaskGroup } from 'models/task/task-group';
import * as mongoose from 'mongoose';
import { Connection, Document } from 'mongoose';
import { Class } from '../../../models/class.model';

export const TASK_GROUP_MODEL = 'TASK_GROUP_MODEL';

export const TaskGroupSchema = new mongoose.Schema(
  { _id: String },
  { strict: false, collection: 'task-group' }
);

export type TaskGroupDocument = TaskGroup & Document;

export const taskGroupModelProvider = {
  provide: TASK_GROUP_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('TaskGroup', TaskGroupSchema),
  inject: ['MONGO_CONNECTION'],
};
