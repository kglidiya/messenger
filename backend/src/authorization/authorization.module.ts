import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { AuthorizationEntity } from './authorization.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorizationEntity])],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, ConfigService],
})
export class AuthorizationModule {}
