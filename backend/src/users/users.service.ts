/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorizationEntity } from '../authorization/authorization.entity';
import { UserData } from '../interfaces';
import { SearchedData } from './interfaces';
import LocalFilesService from 'src/localFile/localFiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AuthorizationEntity)
    private readonly usersRepository: Repository<AuthorizationEntity>,
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
    return userData;
  }

  async searchedUser(searchedData: SearchedData, id: string): Promise<any> {
    const searchedUser = await this.usersRepository
      .createQueryBuilder('users')
      .where({ email: searchedData.email })
      .andWhere('users.id != :currentUserId', {
        currentUserId: id,
      })
      .getOne();
    if (searchedUser) {
      const { password, recoveryCode, createdAt, ...rest } = searchedUser;
      return rest;
    }
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select(['*'])
      .where('users.id = :verifyId', { verifyId: userId })
      .getOne();
    if (user) {
      const { password, recoveryCode, createdAt, ...rest } = user;
      return rest;
    } else return null;
  }
}
