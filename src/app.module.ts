import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user/user.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { DatabaseModule } from './database/database.module';
import { UserService } from './controllers/user/user.service';
import { ClassController } from './controllers/class/class.controller';
import { TaskController } from './controllers/task/task.controller';
import { TaskGroupController } from './controllers/task-group/task-group.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    UserController,
    ClassController,
    TaskController,
    TaskGroupController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
