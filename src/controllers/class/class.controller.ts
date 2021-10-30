import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthUser } from '../../auth/auth-user.decorator';
import { User } from '../../../models/user.model';
import { Class } from '../../../models/class.model';
import { CLASS_MODEL, ClassDocument } from '../../database/model/class.mongo';
import { Model } from 'mongoose';

@Controller('class')
export class ClassController {

  constructor(@Inject(CLASS_MODEL) private classModel: Model<ClassDocument>) {}

  @Post()
  async insertClass(@AuthUser() user: User,
                    @Body() body: Class) {
    body.ownerId = user._id;
    return this.classModel.insertMany(body);
  }

  @Get()
  async getAllClasses(@AuthUser() user: User) {
    return this.classModel.find({ ownerId: user._id });
  }

}
