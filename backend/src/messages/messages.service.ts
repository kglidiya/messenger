import { Injectable } from '@nestjs/common';
import { Between, ILike, Like, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { MessagesEntity } from './messages.entity';
import { IMessageStatus, RoomId } from '../interfaces';
import LocalFilesService from 'src/localFile/localFiles.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthorizationEntity } from 'src/authorization/authorization.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
    @InjectRepository(AuthorizationEntity)
    private readonly usersRepository: Repository<AuthorizationEntity>,
    @InjectRepository(RoomsEntity)
    private readonly roomsRepository: Repository<RoomsEntity>,
    private localFilesService: LocalFilesService,
  ) {}

  async getMessageIndex(id: string, roomId: string) {
    // console.log('id', id);
    const messages = await this.messageRepository.find({
      where: { roomId: roomId },
      order: { createdAt: 'DESC' },
    });
    // console.log('messages', messages);
    const index = messages.findIndex((msg: any) => msg.id === id);
    // console.log('roomId', roomId);
    if (index >= 0) {
      return index;
    } else return 0;
  }

  async getAllMessages(
    roomId: string,
    query: string,
  ): Promise<MessagesEntity[]> {
    // console.log(roomId);
    try {
      // const messagesAll = await this.messageRepository.find({
      //   where: { roomId: roomId },
      //   // relations: ['contact', 'parentMessage', 'parentMessage.contact'],
      //   // order: { createdAt: 'ASC' },
      // });
      // if (query) {
      //   const res = [];
      //   messagesAll.forEach((el, i: number) => {
      //     if (el.message.includes(query)) {
      //       res.push({ message: el, messageIndex: i });
      //     }
      //   });
      //   return res;
      // } else return messagesAll;
      if (query) {
        return await this.messageRepository.find({
          relations: ['contact', 'parentMessage', 'parentMessage.contact'],
          where: [
            {
              roomId: roomId,
              message: ILike(`%${query}%`),
              isDeleted: Not('true'),
            },
            {
              roomId: roomId,
              isDeleted: Not('true'),
              contact: { email: ILike(`%${query}%`) },
            },
            {
              roomId: roomId,
              isDeleted: Not('true'),
              contact: { userName: ILike(`%${query}%`) },
            },
          ],
          order: { createdAt: 'DESC' },
        });
      } else {
        return await this.messageRepository.find({
          where: { roomId: roomId },
          // relations: ['contact', 'parentMessage', 'parentMessage.contact'],
          // order: { createdAt: 'ASC' },
        });
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getPrevMessage(
    limit: number,
    offset: number,
    roomId: RoomId,
    userId: string,
  ): Promise<MessagesEntity[]> {
    // console.log('limit', limit);
    // console.log('offset', offset);
    // console.log('limit', limit);
    try {
      const msgToGroupChart = await this.messageRepository
        .findOne({
          where: { roomId: roomId },
        })
        .then((message) => {
          // console.log(message);
          return message && message.recipientUserId === message.roomId;
        });
      let addedToGroupChartOn;
      if (msgToGroupChart) {
        const room = await this.roomsRepository.findOne({
          where: { id: roomId },
        });

        addedToGroupChartOn = room.participants.filter((user: any) => {
          return user.userId === userId;
        })[0].addedOn;
        // console.log(
        //   room.participants.filter((user: any) => {
        //     console.log('user', user.id === userId);
        //   }),
        // );
      }
      // console.log('addedToGroupChartOn', new Date(addedToGroupChartOn));
      // const firstMessagesAll = await this.messageRepository.find({
      //   where: { roomId: roomId },
      //   order: { createdAt: 'ASC' },
      // });
      // const firstUnreadMsg = firstMessagesAll.findIndex((msg: any) => {
      //   console.log(msg.readBy);
      //   if (msg.readBy.length > 0) {
      //     return !msg.readBy.includes(userId);
      //   } else return msg.readBy.length === 0;
      // });
      // console.log('firstUnreadMsg', firstUnreadMsg);
      // console.log('userId', userId);
      if (addedToGroupChartOn) {
        return await this.messageRepository.find({
          where: {
            roomId: roomId,
            createdAt: Between(new Date(addedToGroupChartOn), new Date()),
          },
          relations: ['contact', 'parentMessage', 'parentMessage.contact'],
          order: { createdAt: 'DESC' },
          skip: offset,
          take: limit,
          // cache: true,
        });
      } else {
        return await this.messageRepository.find({
          where: {
            roomId: roomId,
          },
          relations: ['contact', 'parentMessage', 'parentMessage.contact'],
          order: { createdAt: 'DESC' },
          skip: offset,
          take: limit,
          // cache: true,
        });
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findOneById(id: RoomId): Promise<MessagesEntity[]> {
    // console.log(roomId);
    try {
      return await this.messageRepository.find({
        where: { id },
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createFileMessage(id: string): Promise<any> {
    // console.log(roomId);
    try {
      await this.messageRepository.delete(id);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // async delete(id: string): Promise<any> {
  //   // console.log(roomId);
  //   try {
  //     await this.messageRepository.delete(id);
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }

  async uploadFile(file: any, data: any): Promise<any> {
    // console.log('data:', data);
    // console.log(process.env.REACT_APP_WS_URL);
    // console.log('file:', file);
    const uploadedFile = await this.localFilesService.saveLocalFileData(file);
    // console.log(uploadedFile);
    const id = uuidv4();
    const user = await this.usersRepository.findOne({
      where: { id: data.recipientUserId },
    });
    const message = {
      id: id,
      createdAt: new Date(),
      roomId: data.roomId,
      message: data.message || '',
      currentUserId: data.currentUserId,
      recipientUserId: data.recipientUserId,
      status:
        user && !user.isOnline ? IMessageStatus.SENT : IMessageStatus.DELIVERED,
      file: {
        path: `${process.env.REACT_APP_WS_URL}/files/${uploadedFile.id}`,
        type: uploadedFile.mimetype,
        name: uploadedFile.originalname,
      },
      readBy: [data.readBy],
      // contact: data.contact,
      // parentMessage: data.parentMessage,
      // isForwarded: data.isForwarded ? data.isForwarded : false,
    };
    // console.log('message,', message);
    const createNewMsg = this.messageRepository.create(message);
    // console.log('createNewMsg,', createNewMsg);
    // createNewMsg.id = id;
    const result = await this.messageRepository.save(createNewMsg);
    // console.log('result', result);
    return result;
  }
}
