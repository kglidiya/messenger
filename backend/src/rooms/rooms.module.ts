import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsEntity } from './rooms.entity';
import { AuthorizationEntity } from '../authorization/authorization.entity';
import { MessagesEntity } from 'src/messages/messages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomsEntity,
      AuthorizationEntity,
      MessagesEntity,
    ]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
