import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import LocalFilesService from 'src/localFile/localFiles.service';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController, LocalFilesService],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
