import { createEntity, Entity } from "../entity.model";

export interface Group extends Entity {
  usersId: string[];
  name: string;
  accepted: boolean;
}

export class TaskGroup extends Entity {
  taskId: string;
  groups: Group[];
}

export function createTaskGroup(taskId: string): TaskGroup {
  return {
    taskId,
    groups: []
  } as TaskGroup
}

export function createGroup(usersId?: string[], name?: string): Group {
  return {
    ...createEntity(),
    usersId: usersId || [],
    name,
    accepted: false
  }
}