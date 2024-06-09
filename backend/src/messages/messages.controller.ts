import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { verify } from '../middleware/verifyToken';
import { MessagesEntity } from './messages.entity';
import { IMessage, RoomId } from '../interfaces';
import LocalFilesInterceptor from 'src/localFiles.interceptor';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get('/getAllMessages/:query/:roomId')
  getAllMessages(
    @Param('query') query: string,
    @Param('roomId') roomId: string,
    @Headers() token: string,
  ): Promise<MessagesEntity[]> {
    const ver = verify(token);
    if (ver) {
      const userId = ver.id;
      return this.messageService.getAllMessages(roomId, query, userId);
    } else {
      throw new UnauthorizedException({ key: 'Доступ запрещен' });
    }
  }

  @Get('/getMessageIndex/:id/:roomId')
  getMessageIndex(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
    @Headers() token: string,
  ): Promise<number> {
    const ver = verify(token);
    if (ver) {
      return this.messageService.getMessageIndex(id, roomId);
    } else {
      throw new UnauthorizedException({ key: 'Доступ запрещен' });
    }
  }

  @Get('/getPrevMessage/:limit/:offset/:id')
  getPrevMessage(
    @Param('limit') limit: number,
    @Param('offset') offset: number,
    @Param('id') roomId: RoomId,
    @Headers() token: string,
  ): Promise<MessagesEntity[]> {
    const ver = verify(token);
    if (ver) {
      const userId = ver.id;
      return this.messageService.getPrevMessage(limit, offset, roomId, userId);
    } else {
      throw new UnauthorizedException({ key: 'Доступ запрещен' });
    }
  }

  @Post('/uploadFile')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/files',
    }),
  )
  uploadFile(
    @Headers() token: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: IMessage,
  ): Promise<MessagesEntity> {
    const { id } = verify(token);
    if (id) {
      return this.messageService.uploadFile(file, data);
    } else {
      throw new UnauthorizedException({ key: 'Доступ запрещен' });
    }
  }

  @Delete('/delete')
  remove(@Body('id') id: string) {
    return this.messageService.delete(id);
  }
}
