import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { CLASS_MODEL, ClassDocument } from '../../database/model/class.mongo';
import { Model } from 'mongoose';
import { AuthUser } from '../../auth/auth-user.decorator';
import { User } from '../../../models/user.model';
import { Task } from '../../../models/task/task.model';
import { createEntity } from '../../../models/entity.model';

interface TaskDTO {
  classId: string;
  task: Task;
}

interface CommentDTO {
  comment: string;
  taskId: string;
  classId: string;
}

@Controller('task')
export class TaskController {
  constructor(@Inject(CLASS_MODEL) private classModel: Model<ClassDocument>) {}

  @Post()
  async insertTask(@AuthUser() user: User, @Body() body: TaskDTO) {
    await this.classModel
      .updateOne(
        { _id: body.classId },
        {
          $push: {
            tasks: {
              ...createEntity(),
              title: body.task.title,
              description: body.task.description,
            },
          },
        },
      )
      .exec();

    return this.classModel.findById(body.classId, { tasks: 1 }).lean();
  }

  @Post(':id/editTask')
  async editTask(@AuthUser() user: User, @Body() body: any,  @Param('id') id: string) {
    await this.classModel
      .updateOne(
        { 'tasks._id': id },
        {
          $set: {
            'tasks.$': body
          }
        },
      )
      .exec();

    return this.classModel.findById(body.classId, { tasks: 1 }).lean();
  }

  @Post('comment')
  async insertComment(@AuthUser() user: User, @Body() body: CommentDTO) {
    console.log('a');
    await this.classModel
      .updateOne(
        { _id: body.classId, 'tasks._id': body.taskId },
        {
          $push: {
            'tasks.$.comments': {
              ...createEntity(),
              comment: body.comment,
              userFullName: user.fullName,
              userGivenName: user.givenName,
              userPhoto: user.imageUrl
            },
          },
        },
      )
      .exec();
    // { arrayFilters: [{ 'task.id': body.taskId }] }

    return this.classModel.findById(body.classId, { tasks: 1 }).lean();
  }

  @Get(':id')
  async getAllGroups(@AuthUser() user: User, @Param('id') id: string) {
    const res = await this.classModel.findOne({ 'tasks._id': id }, {'tasks.groups.$': 1}).lean();
    console.log((res.tasks[0] as any).groups);
    return (res.tasks[0] as any).groups;
  }

  @Post(':id/createGroup')
  async createGroup(@AuthUser() user: User, @Body() group: any, @Param('id') id: string) {
    await this.classModel
      .updateOne(
        { 'tasks._id': id },
        {
          $push: {
            'tasks.$.groups': group,
          },
        },
      )
      .exec();
  }

  @Delete(':id/rejectGroup/:groupId')
  async rejectGroup(@AuthUser() user: User, @Param('id') id: string, @Param('groupId') groupId: string) {
    const res = await this.classModel
      .updateOne(
        { 'tasks._id': id,
          'tasks.groups._id': groupId},
        {
          $pull: {
            'tasks.$.groups' : { _id: groupId }
          },
        },
      )
      .exec();
  }

  @Post(':id/manyGroups')
  async createManyGroup(@AuthUser() user: User, @Body() groups: any, @Param('id') id: string) {
    await this.classModel
      .updateOne(
        { 'tasks._id': id },
        {
          $set: {
            'tasks.$.groups': groups,
          },
        },
      )
      .exec();
  }


  @Post(':id/createGroup/deleteAll')
  async deleteAllGroups(@AuthUser() user: User,  @Param('id') id: string) {
    await this.classModel
      .updateOne(
        { 'tasks._id': id },
        {
          $push: {
            'tasks.$.groups': {},
          },
        },
      )
      .exec();
  }

  @Delete(':id')
  async deleteTask(@AuthUser() user: User, @Param('id') id: string) {
    console.log(id);

    await this.classModel
      .updateOne(
        { 'tasks._id': id },
        {
          $pull: { tasks: { _id: id } },
        },
      )
      .exec();
  }
}
