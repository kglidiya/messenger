import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorizationEntity } from '../authorization/authorization.entity';
import { UserData } from '../interfaces';
import { SearchedData } from './interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import LocalFile from 'src/localFile/localFile.entity';
import LocalFilesService from 'src/localFile/localFiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AuthorizationEntity)
    private readonly usersRepository: Repository<AuthorizationEntity>,
    private localFilesService: LocalFilesService,
  ) {}

  async getAllUsers(id: string): Promise<UserData[]> {
    const allUsers = await this.usersRepository
      .createQueryBuilder('users')
      .select('*')
      .where('users.id != :verifyId', { verifyId: id })
      .getMany();
    return allUsers;
  }

  async getOneUserData(userId: string): Promise<UserData> {
    const userData = await this.usersRepository.findOne({
      where: { id: userId },
    });
    // console.log(userData);
    // console.log(userId);
    return userData;
  }

  async searchedUser(
    searchedData: SearchedData,
    id: string,
  ): Promise<AuthorizationEntity[]> {
    const searchedUser = await this.usersRepository
      .createQueryBuilder('users')
      .where({ email: searchedData.email })
      .andWhere('users.id != :currentUserId', {
        currentUserId: id,
      })
      .getMany();
    return searchedUser;
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select(['*'])
      .where('users.id = :verifyId', { verifyId: userId })
      .getOne();
    return user;
  }

  async updateAvatar(userId: string, file: any): Promise<any> {
    const avatar = await this.localFilesService.saveLocalFileData(file);
    // console.log(avatar);
    await this.usersRepository.update(userId, {
      avatar: `http://localhost:3001/files/avatar/${avatar.id}`,
    });
    const user = await this.usersRepository.find({ where: { id: userId } });
    // console.log(user);
    return user;
  }

  // const user = await this.getUserById(userId);
  // if (avatar) {
  //   const userUpdated = await this.usersRepository
  //     .createQueryBuilder('users')
  //     .update<AuthorizationEntity>(AuthorizationEntity, {
  //       ...user,
  //       avatar,
  //     })
  //     .where({ id: userId })
  //     .execute();
  //   return userUpdated;
  // }

  // if (avatar) {
  //   const userUpdated = await this.usersRepository
  //     .createQueryBuilder('users')
  //     .update<AuthorizationEntity>(AuthorizationEntity, {
  //       ...user,
  //       userName,
  //     })
  //     .where({ id: userId })
  //     .execute();
  //   return userUpdated;
  // }
  // }

  // async findOneByEmail(email: string): Promise<any> {
  //   return await this.usersRepository.findOne({ where: { email } });
  // }

  // async findOneByRecoveryCode(code: number): Promise<any> {
  //   return await this.usersRepository.findOne({
  //     where: { recoveryCode: code },
  //   });
  // }
}
