import { Entity } from './entity.model';
import { Task } from './task/task.model';
import { Collaboration } from './collaboration.model';

export interface Class extends Entity {
  name: string;
  description: string;
  tasks: Task[];
  collaborations: Collaboration[];
  ownerId: string;
}
