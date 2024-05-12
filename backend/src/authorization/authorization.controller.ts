import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import LocalFilesInterceptor from '../localFiles.interceptor';

import { AuthorizationService } from './authorization.service';
import { AuthorizationEntity } from './authorization.entity';

@Controller()
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('signup')
  reg(@Body() regData: AuthorizationEntity): Promise<AuthorizationEntity> {
    return this.authorizationService.registration(regData);
  }

  @Post('signin')
  log(@Body() loginData: AuthorizationEntity): Promise<object> {
    return this.authorizationService.login(loginData);
  }

  @Get('refresh')
  refresh(@Headers() token: any): Promise<string[]> {
    const refreshToken = token.authorization.split(' ')[1];
    return this.authorizationService.refresh(refreshToken);
  }

  @Post('forgot-password')
  forgotpass(@Body() data: { email: string }): Promise<any> {
    // console.log(data);
    return this.authorizationService.forgotpassword(data.email);
  }

  @Post('reset-password')
  otp(@Body() data: { recoveryCode: number; password: string }): Promise<any> {
    // console.log(data);
    const { recoveryCode, password } = data;
    return this.authorizationService.resetPassword(recoveryCode, password);
  }
}
