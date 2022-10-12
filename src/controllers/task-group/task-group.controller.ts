import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { createTaskGroup, Group, TaskGroup } from 'models/task/task-group';
import { TaskGroupDto } from 'models/task/task-group-dto';
import { User } from 'models/user.model';
import { Model } from 'mongoose';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { TaskGroupDocument, TASK_GROUP_MODEL } from 'src/database/model/task-group.mongo';
import { UserDocument, USER_MODEL } from 'src/database/model/user.mongo';
import { UserService } from '../user/user.service';

@Controller('task-group/:taskId')
export class TaskGroupController {

  constructor(@Inject(TASK_GROUP_MODEL) private model: Model<TaskGroupDocument>,
             private userService: UserService) {}

  @Get()
  async get(@AuthUser() user: User,
            @Param('taskId') taskId: string): Promise<TaskGroupDto[]> {
    let taskGroup: TaskGroup = await this.model.findOne({ taskId }).lean();
    if(!taskGroup) {
      taskGroup = createTaskGroup(taskId);
      await this.model.insertMany([taskGroup]);
    }

    const groups: TaskGroupDto[] = [];

    taskGroup.groups.forEach(g => {
      const group: Partial<User>[] = [];
      g.usersId.forEach(async uID => {
        const user = await this.userService.findById(uID);
        group.push({
          _id: user._id,
          fullName: user.fullName,
          givenName: user.givenName,
          imageUrl: user.imageUrl
        })
      });
      groups.push({
        group: group
      })
    })
    return groups;
  }

  @Post()
  async createGroup(@AuthUser() user: User,
                    @Body() group: Group,
                    @Param('taskId') taskId: string): Promise<void> {
    const taskGroup: TaskGroup = await this.model.findOne({ taskId }).lean();
    await this.model.findOneAndUpdate(
      {taskId},
      {
        $set: {
          groups: {
            ...taskGroup.groups,
            group
          }
        }
      }
    )
  }
  
}
