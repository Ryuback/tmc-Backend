import { Entity } from './entity.model';

export interface Task extends Entity {
  name: string;
  description: string;
}
