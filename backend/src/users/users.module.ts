import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthorizationEntity } from '../authorization/authorization.entity';
import { ConfigService } from '@nestjs/config';
import LocalFilesService from 'src/localFile/localFiles.service';
import LocalFile from 'src/localFile/localFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorizationEntity, LocalFile])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, LocalFilesService],
})
export class UsersModule {}
