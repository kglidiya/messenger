import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFile from './localFile.entity';
import LocalFilesController from './localFiles.controller';
import LocalFilesService from './localFiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFile])],
  controllers: [LocalFilesController],
  providers: [LocalFilesService],
})
export class LocalFilesModule {}
