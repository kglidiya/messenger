import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LocalFile from './localFile.entity';
import { IAvatar } from 'src/authorization/interfaces';

@Injectable()
class LocalFilesService {
  constructor(
    @InjectRepository(LocalFile)
    private localFilesRepository: Repository<LocalFile>,
  ) {}

  async saveLocalFileData(file: any): Promise<any> {
    // console.log(file);
    const newFile = this.localFilesRepository.create(file);
    const fileData = await this.localFilesRepository.save(newFile);
    // console.log(fileData);
    return fileData;
  }

  async getFileById(fileId: number) {
    const file = await this.localFilesRepository.findOne(fileId);
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}

export default LocalFilesService;
