import { Inject, Injectable } from '@nestjs/common';
import { USER_MODEL, UserDocument } from '../../database/model/user.mongo';
import { Model } from 'mongoose';
import { User } from '../../../models/user.model';

@Injectable()
export class UserService {
  constructor(@Inject(USER_MODEL) private model: Model<UserDocument>) {}

  async create(
    _id: string,
    fullName: string,
    givenName: string,
    imageUrl: string,
    email: string,
    emailVerified: boolean,
  ): Promise<User> {
    if (!fullName) {
      fullName = '';
    }

    const user: User = {
      _id,
      fullName,
      givenName,
      imageUrl,
      email,
      emailVerified,
      showWelcomeWizard: true,
      // language: 'en' //TODO: configurar dinamicamente
    };
    await new this.model(user).save();
    console.log('#> UserService.createUser', user);
    return user;
  }

  async findById(uid: string): Promise<User> {
    return this.model.findById(uid).lean();
  }
}
