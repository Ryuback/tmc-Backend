import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthUser } from '../../auth/auth-user.decorator';
import { User } from '../../../models/user.model';
import { Class } from '../../../models/class.model';
import { CLASS_MODEL, ClassDocument } from '../../database/model/class.mongo';
import { Model } from 'mongoose';
import { createEntity } from '../../../models/entity.model';
import { generateQualities } from '../../../models/quality.model';
import { UpdateResult } from 'mongodb';

@Controller('class')
export class ClassController {
  constructor(@Inject(CLASS_MODEL) private classModel: Model<ClassDocument>) {}

  @Post()
  async insertClass(@AuthUser() user: User, @Body() body: Class) {
    body.ownerId = user._id;
    body.collaborations = [];
    return this.classModel.insertMany(body);
  }

  @Get()
  async getAllClasses(@AuthUser() user: User) {
    return this.classModel.find(
      // { ownerId: user._id }
      { $or: [{ ownerId: user._id }, { 'collaborations.userId': user._id }] },
    );
  }

  @Post('enterWithLink')
  async enterWithLink(@AuthUser() user: User, @Query('id') classId: string): Promise<void> {
    const classe = await this.classModel.findById(classId).lean();

    const student = classe.collaborations.find(
      (student) => student.userId === user._id,
    );
    if (student) {
      throw new HttpException('Usuário já existente na classe', 422);
    }

    await this.classModel
      .updateOne(
        { _id: classId },
        {
          $push: {
            collaborations: {
              ...createEntity(),
              userId: user._id,
              givenName: user.givenName,
              fullName: user.fullName,
              qualities: generateQualities(),
            },
          },
        },
      )
      .exec();
  }

  @Post('dailyCall')
  async dailyCall(
    @AuthUser() user: User,
    @Query('classId') classId: string,
    @Body() body: { userId: string; isChecked }[],
  ) {
    console.log(classId);

    console.log(body);
    for (const v of body) {
      await this.classModel
        .updateOne(
          { _id: classId, 'collaborations.userId': v.userId },
          {
            $inc: {
              'collaborations.$.absent': 1,
            },
          },
          { multi: true },
        )
        .exec();
    }
  }

  @Post('addQuality')
  async addQuality(
    @AuthUser() user: User,
    @Query('classId') classId: string,
    @Body() body: { studentId: string; quality },
  ) {
    await this.classModel
      .updateOne(
        {
          _id: classId,
          'collaborations.userId': body.studentId,
        },
        {
          $inc: {
            'collaborations.$.qualities.$[qualities].count': 1,
          },
        },
        { arrayFilters: [{ 'qualities.name': body.quality }], upsert: true },
      )
      .exec();
  }

  @Patch(':classId')
  async updateClass(
    @AuthUser() user: User,
    @Param('classId') classId: string,
    @Body() updatedClass: Class ) {

    await this.classModel.updateOne({
      _id: classId
    },
      {
        $set: updatedClass
      })
  }

  @Delete(':classId')
  async removeClass(@AuthUser() user: User,
                    @Param('classId') classId: string) {
    await this.classModel.remove({
      _id: classId
    })
  }
}
