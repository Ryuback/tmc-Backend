import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthUser } from '../../auth/auth-user.decorator';
import { User } from '../../../models/user.model';
import { Class } from '../../../models/class.model';
import { CLASS_MODEL, ClassDocument } from '../../database/model/class.mongo';
import { Model } from 'mongoose';

@Controller('class')
export class ClassController {

  constructor(@Inject(CLASS_MODEL) private classModel: Model<ClassDocument>) {}

  @Post()
  async getUser(@AuthUser() user: User,
                @Body() body: Class) {
    console.log('CLASS');
    console.log(body);
    return await this.classModel.insertMany(body);
  }

}
