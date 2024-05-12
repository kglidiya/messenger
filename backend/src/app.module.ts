import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { AuthorizationModule } from './authorization/authorization.module';
import { UsersModule } from './users/users.module';
import ormconfig from './ormconfig';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesEntity } from './messages/messages.entity';
import { MessagesModule } from './messages/messages.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthorizationEntity } from './authorization/authorization.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { LocalFilesModule } from './localFile/localFiles.module';
import LocalFile from './localFile/localFile.entity';
import { RoomsEntity } from './rooms/rooms.entity';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forFeature([
      MessagesEntity,
      AuthorizationEntity,
      LocalFile,
      RoomsEntity,
    ]),
    TypeOrmModule.forRoot(ormconfig),
    AuthorizationModule,
    UsersModule,
    RoomsModule,
    MessagesModule,
    LocalFilesModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: process.env.MAILDEV_SERVICE,
          host: process.env.MAILDEV_HOST,
          port: Number(process.env.MAILDEV_PORT),
          secure: false,
          auth: {
            user: process.env.MAILDEV_INCOMING_USER,
            pass: process.env.MAILDEV_INCOMING_PASS,
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
