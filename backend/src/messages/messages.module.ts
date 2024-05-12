import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesEntity } from './messages.entity';
import LocalFilesService from 'src/localFile/localFiles.service';
import LocalFile from 'src/localFile/localFile.entity';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthorizationEntity } from 'src/authorization/authorization.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      LocalFile,
      AuthorizationEntity,
      RoomsEntity,
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ConfigService, LocalFilesService, UsersService],
})
export class MessagesModule {}
