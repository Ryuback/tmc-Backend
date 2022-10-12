import { Test, TestingModule } from '@nestjs/testing';
import { TaskGroupController } from './task-group.controller';

describe('TaskGroupController', () => {
  let controller: TaskGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskGroupController],
    }).compile();

    controller = module.get<TaskGroupController>(TaskGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
