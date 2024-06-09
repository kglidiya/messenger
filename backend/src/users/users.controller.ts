import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { verify } from '../middleware/verifyToken';
import { UserData, UserId } from '../interfaces';
import { AuthorizationEntity } from '../authorization/authorization.entity';
import { SearchedData } from './interfaces';
import { Express } from 'express';
import LocalFilesInterceptor from '../localFiles.interceptor';
import { ConfigService } from '@nestjs/config';
import LocalFilesService from 'src/localFile/localFiles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserResponse } from 'src/authorization/interfaces';

@Controller('users')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private localFilesService: LocalFilesService,
  ) {}

  @Get('getAllUsers')
  getAllUsers(@Headers() token: object): Promise<UserData[]> {
    const ver = verify(token);
    if (ver) {
      return this.UsersService.getAllUsers(ver.id);
    } else {
      throw new UnauthorizedException({ key: 'E Dfc ytn ' });
    }
  }

  @Post('getOneUserData')
  getOneUserData(
    @Headers() token: object,
    @Body() userId: UserId,
  ): Promise<UserData> {
    const ver = verify(token);
    if (ver) {
      return this.UsersService.getOneUserData(userId.userId);
    } else {
      throw new UnauthorizedException({ key: 'Нет прав' });
    }
  }

  @Post('searchedUser')
  searchedUser(
    @Headers() token: object,
    @Body() searchedData: SearchedData,
  ): Promise<UserResponse> {
    const { id } = verify(token);
    if (id) {
      return this.UsersService.searchedUser(searchedData, id);
    } else {
      throw new UnauthorizedException({ key: 'Нет прав' });
    }
  }
}
