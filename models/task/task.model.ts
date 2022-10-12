import { Entity } from '../entity.model';

export interface Comment {
  userPhoto: string;
  userFullName: string;
  comment: string;
}

export interface Task extends Entity {
  title: string;
  description: string;
  comments: Comment[];
}
