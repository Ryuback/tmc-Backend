import { Entity } from './entity.model';
import { Task } from './task.model';

export interface Class extends Entity {
  name: string;
  description: string;
  tasks: Task[];
}
