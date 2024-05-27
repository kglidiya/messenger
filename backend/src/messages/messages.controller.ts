import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { verify } from '../middleware/virifyToken';
import { MessagesEntity } from './messages.entity';
import { RoomId } from '../interfaces';
import LocalFilesInterceptor from 'src/localFiles.interceptor';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get('/getAllMessages/:query/:roomId')
  getAllMessages(
    @Param('query') query: string,
    @Param('roomId') roomId: string,
    // param: { limit: number; offset: number; roomId: RoomId },
    // @Body() roomId: RoomId,
    @Headers() token: any,
  ): Promise<MessagesEntity[]> {
    // console.log('roomId', roomId);

    const ver = verify(token);
    if (ver) {
      return this.messageService.getAllMessages(roomId, query);
    } else {
      throw new UnauthorizedException({ key: 'Invalid token!' });
    }
  }

  @Get('/getMessageIndex/:id/:roomId')
  getMessageIndex(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
    // param: { limit: number; offset: number; roomId: RoomId },
    // @Body() roomId: RoomId,
    @Headers() token: any,
  ): Promise<number> {
    // console.log('roomId', roomId);

    const ver = verify(token);
    if (ver) {
      return this.messageService.getMessageIndex(id, roomId);
    } else {
      throw new UnauthorizedException({ key: 'Invalid token!' });
    }
  }

  @Get('/getPrevMessage/:limit/:offset/:id')
  getPrevMessage(
    @Param('limit') limit: number,
    @Param('offset') offset: number,
    @Param('id') roomId: RoomId,
    // param: { limit: number; offset: number; roomId: RoomId },
    // @Body() roomId: RoomId,
    @Headers() token: any,
  ): Promise<MessagesEntity[]> {
    // console.log('roomId', roomId);
    // console.log('limit,', limit);
    // console.log('offset', offset);
    const ver = verify(token);
    if (ver) {
      // console.log(ver);
      const userId = ver.id;
      // console.log('userId', ver);
      return this.messageService.getPrevMessage(limit, offset, roomId, userId);
    } else {
      throw new UnauthorizedException({ key: 'Invalid token!' });
    }
  }

  // @Delete('/delete')
  // deleteMessage(
  //   // @Param('id') roomId: RoomId,
  //   // @Body() roomId: RoomId,
  //   @Headers() token: any,
  // ): Promise<any> {
  //   // console.log(roomId);
  //   const ver = verify(token);
  //   if (ver) {
  //     return this.messageService.delete('messages');
  //   } else {
  //     throw new UnauthorizedException({ key: 'Invalid token!' });
  //   }
  // }

  @Post('/uploadFile')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/files',
    }),
  )
  updateUser(
    @Headers() token: object,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any,
    // @Query() data: any,
  ): Promise<any> {
    const { id } = verify(token);
    // console.log(data);
    if (id) {
      return this.messageService.uploadFile(file, data);
    } else {
      throw new UnauthorizedException({ key: 'Invalid token!' });
    }
  }
  @Delete('/delete')
  remove(@Body('id') id: string): Promise<any> {
    return this.messageService.delete(id);
  }

  // @Get('/t')
  // get(): Promise<any> {
  //   return this.messageService.t();
  // }
}
