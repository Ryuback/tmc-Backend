import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUser } from '../../auth/auth-user.decorator';
import { User } from '../../../models/user.model';
import { ClassDocument } from '../../database/model/class.mongo';
import { Model } from 'mongoose';
import { USER_MODEL } from '../../database/model/user.mongo';

@Controller('user')
export class UserController {

  constructor(private userService: UserService,
              @Inject(USER_MODEL) private userModel: Model<ClassDocument>) {}

  @Get('me')
  async getUser(@AuthUser() user: User) {
    return this.userService.findById(user._id);
  }

  @Post('afterRegisterWithEmail')
  async afterRegisterWithEmail(@AuthUser() user: User,
                               @Body() body: { fullName: string, givenName: string }) {
    console.log('#afterRegisterWithEmail => ', body);
    return this.userModel.updateOne(
      { _id: user._id },
      {
        fullName: body.fullName,
        givenName: body.givenName,
        imageUrl: null
      }).exec();
  }
}
