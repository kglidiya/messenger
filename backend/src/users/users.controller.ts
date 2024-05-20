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
import { verify } from '../middleware/virifyToken';
import { UserData, UserId } from '../interfaces';
import { AuthorizationEntity } from '../authorization/authorization.entity';
import { SearchedData } from './interfaces';
import { Express } from 'express';
import LocalFilesInterceptor from '../localFiles.interceptor';
import { ConfigService } from '@nestjs/config';
import LocalFilesService from 'src/localFile/localFiles.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
      throw new UnauthorizedException({ key: 'Invalid token!' });
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
      throw new UnauthorizedException({ key: 'Invalid token!' });
    }
  }

  @Post('searchedUser')
  searchedUser(
    @Headers() token: object,
    @Body() searchedData: SearchedData,
  ): Promise<AuthorizationEntity[]> {
    const { id } = verify(token);
    // console.log(id);
    if (id) {
      return this.UsersService.searchedUser(searchedData, id);
    } else {
      throw new UnauthorizedException({ key: 'Invalid token!' });
    }
  }

  // @Post('updateAvatar')
  // @UseInterceptors(
  //   LocalFilesInterceptor({
  //     fieldName: 'file',
  //     path: '/avatars',
  //   }),
  // )
  // updateUser(
  //   @Headers() token: object,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<AuthorizationEntity> {
  //   const { id } = verify(token);
  //   if (id) {
  //     return this.UsersService.updateAvatar(id, file);
  //   } else {
  //     throw new UnauthorizedException({ key: 'Invalid token!' });
  //   }
  // }
}