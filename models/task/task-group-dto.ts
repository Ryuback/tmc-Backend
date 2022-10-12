import { User } from "models/user.model";

export interface TaskGroupDto {
  group: Partial<User>[];
}