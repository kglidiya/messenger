import { Body, Controller, Get, Headers, Post } from '@nestjs/common';

import { AuthorizationService } from './authorization.service';
import { AuthorizationEntity } from './authorization.entity';
import { ITokenPair, UserResponse } from './interfaces';

@Controller()
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('signup')
  reg(@Body() regData: AuthorizationEntity): Promise<UserResponse> {
    return this.authorizationService.registration(regData);
  }

  @Post('signin')
  log(@Body() loginData: AuthorizationEntity): Promise<UserResponse> {
    return this.authorizationService.login(loginData);
  }

  @Get('refresh')
  refresh(@Headers() token: any): Promise<ITokenPair> {
    const refreshToken = token.authorization.split(' ')[1];
    return this.authorizationService.refresh(refreshToken);
  }

  @Post('forgot-password')
  forgotpass(@Body() data: { email: string }): Promise<string> {
    return this.authorizationService.forgotpassword(data.email);
  }

  @Post('reset-password')
  otp(
    @Body() data: { recoveryCode: number; password: string },
  ): Promise<string> {
    const { recoveryCode, password } = data;
    return this.authorizationService.resetPassword(recoveryCode, password);
  }
}
