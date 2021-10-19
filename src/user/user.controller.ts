import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../../models/user.model';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @Get('me')
  async getUser(@AuthUser() user: User) {
    return this.userService.findById(user._id);
  }
}
