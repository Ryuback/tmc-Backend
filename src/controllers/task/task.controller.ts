import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { CLASS_MODEL, ClassDocument } from '../../database/model/class.mongo';
import { Model } from 'mongoose';
import { AuthUser } from '../../auth/auth-user.decorator';
import { User } from '../../../models/user.model';
import { Task } from '../../../models/task.model';
import { createEntity } from '../../../models/entity.model';

interface TaskDTO {
  classId: string,
  task: Task
}

interface CommentDTO {
  comment: string,
  taskId: string,
  classId: string
}

@Controller('task')
export class TaskController {

  constructor(@Inject(CLASS_MODEL) private classModel: Model<ClassDocument>) {}

  @Post()
  async insertTask(@AuthUser() user: User,
                   @Body() body: TaskDTO) {
    await this.classModel.updateOne({ _id: body.classId },
      {
        $push: {
          tasks: {
            ...createEntity(),
            title: body.task.title,
            description: body.task.description
          }
        }
      }).exec();

    return this.classModel.findById(body.classId, { tasks: 1 }).lean();
  }

  @Post('comment')
  async insertComment(@AuthUser() user: User,
                      @Body() body: CommentDTO) {
    console.log('a');
    await this.classModel.updateOne({ _id: body.classId, 'tasks._id': body.taskId },
      {
        $push: {
          'tasks.$.comments': {
            ...createEntity(),
            comment: body.comment,
            userFullName: user.fullName,
            userGivenName: user.givenName
          }
        }
      }).exec();
    // { arrayFilters: [{ 'task.id': body.taskId }] }

    return this.classModel.findById(body.classId, { tasks: 1 }).lean();
  }

  @Delete(':id')
  async deleteTask(@AuthUser() user: User,
                   @Param('id') id: string) {
    console.log(id);

    return this.classModel.updateOne({ 'tasks._id': id }, {
      $pull: { tasks: { _id: id } }
    }).exec();

  }
}
