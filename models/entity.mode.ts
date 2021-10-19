import { nanoid } from 'nanoid';

export class Entity {
  _id: string;
}

export function createEntity() {
  return {
    _id: nanoid()
  } as Entity;
}