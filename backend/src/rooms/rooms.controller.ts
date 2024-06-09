import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { verify } from '../middleware/verifyToken';
import { RoomsService } from './rooms.service';
import { GroupData, IAllGroupsResponse, IRoom } from './interfaces';
import { UserId } from '../interfaces';
import { RoomsEntity } from './rooms.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('createGroupChat')
  createGroupChat(
    @Body() groupData: GroupData,
    @Headers() token: string,
  ): Promise<RoomsEntity> {
    const ver = verify(token);
    if (ver) {
      return this.roomsService.createGroupChat(groupData);
    } else {
      throw new UnauthorizedException({ key: 'У Вас недостаточно прав' });
    }
  }

  @Post('getAllGroups')
  getAllGroups(
    @Body() userId: UserId,
    @Headers() token: string,
  ): Promise<IAllGroupsResponse> {
    const ver = verify(token);
    if (ver) {
      return this.roomsService.getAllGroups(userId.userId);
    } else {
      throw new UnauthorizedException({ key: 'У Вас недостаточно прав' });
    }
  }

  @Post('getOneGroup')
  getGroupById(
    @Body() data: { roomId: string },
    @Headers() token: string,
  ): Promise<IRoom> {
    const ver = verify(token);
    if (ver) {
      const userId = ver.id;
      return this.roomsService.getOneGroup(data.roomId, userId);
    } else {
      throw new UnauthorizedException({ key: 'У Вас недостаточно прав' });
    }
  }
}
