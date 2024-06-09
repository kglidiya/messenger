import { Injectable } from '@nestjs/common';
import { Between, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { MessagesEntity } from './messages.entity';
import { IMessage, IMessageStatus, RoomId } from '../interfaces';
import LocalFilesService from 'src/localFile/localFiles.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthorizationEntity } from 'src/authorization/authorization.entity';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { decrypt } from 'src/helpers/crypto';
import { IParticipants } from 'src/rooms/interfaces';

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
    const messages = await this.messageRepository.find({
      where: { roomId: roomId },
      order: { createdAt: 'DESC' },
    });
    const index = messages.findIndex((msg: MessagesEntity) => msg.id === id);
    if (index >= 0) {
      return index;
    } else return 0;
  }

  async getAllMessages(
    roomId: string,
    query: string,
    userId: string,
  ): Promise<MessagesEntity[]> {
    try {
      if (query) {
        const msgToGroupChart = await this.messageRepository
          .findOne({
            where: { roomId: roomId },
          })
          .then((message) => {
            return message && message.recipientUserId === message.roomId;
          });
        let addedToGroupChartOn;
        if (msgToGroupChart) {
          const room = await this.roomsRepository.findOne({
            where: { id: roomId },
          });

          addedToGroupChartOn = room.participants.filter((user) => {
            return user.userId === userId;
          })[0].addedOn;
        }

        const msg = await this.messageRepository.find({
          relations: ['contact'],
          where: [
            {
              roomId: roomId,
              isDeleted: Not('true'),
              createdAt: addedToGroupChartOn
                ? Between(new Date(addedToGroupChartOn), new Date())
                : Between(new Date('03-06-2024'), new Date()),
            },
          ],
          order: { createdAt: 'DESC' },
        });
        return msg.filter((m) => {
          if (
            (m.message &&
              decrypt(m.message).toLowerCase().includes(query.toLowerCase())) ||
            (m.contact &&
              m.contact.email.toLowerCase().includes(query.toLowerCase())) ||
            (m.contact &&
              m.contact.userName &&
              m.contact.userName.toLowerCase().includes(query.toLowerCase()))
          ) {
            return m;
          }
        });
      } else {
        return await this.messageRepository.find({
          where: { roomId: roomId },
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
    try {
      const msgToGroupChart = await this.messageRepository
        .findOne({
          where: { roomId: roomId },
        })
        .then((message) => {
          return message && message.recipientUserId === message.roomId;
        });
      let addedToGroupChartOn;
      if (msgToGroupChart) {
        const room = await this.roomsRepository.findOne({
          where: { id: roomId },
        });

        addedToGroupChartOn = room.participants.filter((user) => {
          return user.userId === userId;
        })[0].addedOn;
      }

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
          cache: true,
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
          cache: true,
        });
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async delete(id: string) {
    const messageToDelete = await this.messageRepository.delete(id);
    return messageToDelete;
  }

  async uploadFile(
    file: Express.Multer.File,
    data: IMessage,
  ): Promise<MessagesEntity> {
    const uploadedFile = await this.localFilesService.saveLocalFileData(file);
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
        path: `${process.env.REACT_APP_SERVER_URL}/files/${uploadedFile.id}`,
        type: uploadedFile.mimetype,
        name: uploadedFile.originalname,
      },
      readBy: [data.readBy],
    };

    const createNewMsg = this.messageRepository.create(message);
    const result = await this.messageRepository.save(createNewMsg);
    return result;
  }
}
