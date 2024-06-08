/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsResponse,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, NotFoundException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable } from 'rxjs';

import { MessagesEntity } from './messages/messages.entity';
import {
  IMessage,
  IMessageStatus,
  IReactions,
  ReactionsData,
  RoomId,
} from './interfaces';
import { AuthorizationEntity } from './authorization/authorization.entity';
import { RoomsEntity } from './rooms/rooms.entity';
import { IRoom } from './rooms/interfaces';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly msgRepository: Repository<MessagesEntity>,
    @InjectRepository(AuthorizationEntity)
    private readonly usersRepository: Repository<AuthorizationEntity>,
    @InjectRepository(RoomsEntity)
    private readonly roomsRepository: Repository<RoomsEntity>,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('meeting')
  joinUserToMeeting(
    @MessageBody() data: RoomId,
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<any>> {
    client.join(data.roomId);
    this.server.emit('meeting', `in a room ${data.roomId}`);
    return from([data.roomId]).pipe(
      map(() => {
        return {
          event: 'meeting',
          data: data.roomId,
        };
      }),
    );
  }

  @SubscribeMessage('send-message')
  async handleMessage(client: Socket, payload: IMessage): Promise<void> {
    const recipientsCount = payload.recipientUserId.split(',').length;

    const user =
      recipientsCount === 1
        ? await this.usersRepository.findOne({
            where: { id: payload.recipientUserId },
          })
        : null;

    const newMessage = {
      id: payload.id,
      createdAt: new Date(),
      roomId: payload.roomId,
      currentUserId: payload.currentUserId,
      recipientUserId:
        recipientsCount > 1 ? payload.roomId : payload.recipientUserId,
      message: payload.message,
      status:
        user && !user.isOnline ? IMessageStatus.SENT : IMessageStatus.DELIVERED,
      file: payload.file,
      contact: payload.contact,
      parentMessage: payload.parentMessage,
      isForwarded: payload.isForwarded,
      readBy: [payload.readBy],
    };
    const createNewMsg = this.msgRepository.create(newMessage);

    const result = await this.msgRepository.save(createNewMsg);
    this.server.emit('receive-message', result);
  }

  @SubscribeMessage('send-file')
  async handleFile(client: Socket, payload: any): Promise<void> {
    const result = await this.msgRepository.findOne({
      where: { id: payload.id },
    });
    if (!result) {
      throw new NotFoundException('Сообщение не найдено');
    }
    this.server.emit('receive-message', result);
  }

  @SubscribeMessage('react-to-message')
  async handleReactions(client: Socket, payload: ReactionsData): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });
    const reaction = {
      reaction: payload.reaction,
      from: payload.from,
    };

    const findDuplicateReaction = message.reactions.filter((reaction: any) => {
      return reaction.from === payload.from;
    });
    if (!findDuplicateReaction) {
      await this.msgRepository
        .createQueryBuilder('messages')
        .update<MessagesEntity>(MessagesEntity, {
          ...message,
          reactions: [...message.reactions, reaction],
        })
        .where({ id: payload.messageId })
        .execute();
    } else {
      const otherUsersReaction = message.reactions.filter((reaction: any) => {
        return reaction.from !== payload.from;
      });
      await this.msgRepository
        .createQueryBuilder('messages')
        .update<MessagesEntity>(MessagesEntity, {
          ...message,
          reactions: [...otherUsersReaction, reaction],
        })
        .where({ id: payload.messageId })
        .execute();
    }

    const res = await this.msgRepository.findOne({
      where: { id: payload.messageId },
      relations: ['contact', 'parentMessage', 'parentMessage.contact'],
    });

    this.server.to(payload.roomId).emit('receive-reaction', res);
  }

  @SubscribeMessage('edit-message')
  async handleMessageEdit(client: Socket, payload: IMessage): Promise<void> {
    const messageToEdit = await this.msgRepository.findOne({
      where: { id: payload.id },
    });
    if (!messageToEdit) {
      throw new NotFoundException('Сообщение не найдено');
    }
    await this.msgRepository
      .createQueryBuilder('messages')
      .update<MessagesEntity>(MessagesEntity, {
        ...messageToEdit,
        modified: true,
        message: payload.message,
      })
      .where({ id: payload.id })
      .execute();

    const res = await this.msgRepository.findOne({
      where: { id: payload.id },
      relations: ['contact', 'parentMessage', 'parentMessage.contact'],
    });
    this.server.to(payload.roomId).emit('receive-updatedMessage', res);
  }

  @SubscribeMessage('delete-reaction')
  async deleteReaction(client: Socket, payload: ReactionsData): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });
    const reactionsUpdated = message.reactions.filter((reaction: any) => {
      return reaction.from !== payload.from;
    });
    await this.msgRepository
      .createQueryBuilder('messages')
      .update<MessagesEntity>(MessagesEntity, {
        ...message,
        reactions: reactionsUpdated,
      })
      .where({ id: payload.messageId })
      .execute();

    const res = await this.msgRepository.findOne({
      where: { id: payload.messageId },
      relations: ['contact', 'parentMessage', 'parentMessage.contact'],
    });
    this.server.to(payload.roomId).emit('receive-reaction', res);
  }

  @SubscribeMessage('update-message-status')
  async handleMessageStatusChange(
    client: Socket,
    payload: { messageId: string; roomId: string; readBy: string },
  ): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });
    if (!message) {
      throw new NotFoundException('Сообщение не найдено');
    }
    const room = await this.roomsRepository.findOne({
      where: { id: payload.roomId },
    });

    await this.msgRepository
      .createQueryBuilder('messages')
      .update<MessagesEntity>(MessagesEntity, {
        ...message,
        status:
          message.readBy.length < room.usersId.split(',').length - 1
            ? IMessageStatus.DELIVERED
            : IMessageStatus.READ,
        readBy: [...message.readBy, payload.readBy],
      })
      .where({ id: payload.messageId })
      .execute();
    const res = await this.msgRepository.findOne({
      where: { id: payload.messageId },
      relations: ['contact', 'parentMessage', 'parentMessage.contact'],
    });
    this.server.to(payload.roomId).emit('receive-message-status', res);
  }

  @SubscribeMessage('delete-message')
  async deleteMessage(
    client: Socket,
    payload: { messageId: string; roomId: string },
  ): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });
    if (!message) {
      throw new NotFoundException('Сообщение не найдено');
    }
    await this.msgRepository
      .createQueryBuilder('messages')
      .update<MessagesEntity>(MessagesEntity, {
        ...message,
        isDeleted: true,
      })
      .where({ id: payload.messageId })
      .execute();

    const res = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });
    this.server.to(payload.roomId).emit('receive-message-deleted', res);
  }

  @SubscribeMessage('update-userData')
  async handleUserState(
    client: Socket,
    payload: {
      userId: string;
      isOnline: boolean;
      avatar: string;
      userName: string;
    },
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.usersRepository
      .createQueryBuilder('users')
      .update<AuthorizationEntity>(AuthorizationEntity, {
        ...user,
        isOnline:
          payload.isOnline !== undefined ? payload.isOnline : user.isOnline,
        avatar: payload.avatar ? payload.avatar : user.avatar,
        userName: payload.userName ? payload.userName : user.userName,
      })
      .where({ id: payload.userId })
      .execute();

    const res = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });
    const { password, recoveryCode, createdAt, ...rest } = res;

    this.server.emit('receive-userData', rest);
  }

  @SubscribeMessage('update-typingState')
  async handleTyping(
    client: Socket,
    payload: { roomId: string; userId: string; isTyping: boolean },
  ): Promise<void> {
    this.server.to(payload.roomId).emit('receive-typingState', payload);
  }

  @SubscribeMessage('create-chat')
  async createChat(
    client: Socket,
    payload: { usersId: string },
  ): Promise<void> {
    this.server.emit('receive-newChatData', payload.usersId);
  }

  @SubscribeMessage('edit-group')
  async editGroup(client: Socket, payload: any): Promise<void> {
    const room = await this.roomsRepository.findOne({
      where: { id: payload.roomId },
    });
    if (!room) {
      throw new NotFoundException('Чат не найден');
    }
    await this.roomsRepository
      .createQueryBuilder('rooms')
      .update<RoomsEntity>(RoomsEntity, {
        ...room,
        admin: payload.admin ? payload.admin : room.admin,
        name: payload.groupName ? payload.groupName : room.name,
        avatar: payload.avatar ? payload.avatar : room.avatar,
        usersId: payload.usersId
          ? payload.usersId.split(',').sort().join()
          : room.usersId,
        participants: payload.participants
          ? payload.participants
          : room.participants,
      })
      .where({ id: payload.roomId })
      .execute();

    // const groupUpdated = { participants: [] };
    const result = (await this.roomsRepository.findOne({
      where: { id: payload.roomId },
    })) as any;
    for (let i = 0; i < result.participants.length; i++) {
      const userData = await this.usersRepository.findOne({
        where: { id: result.participants[i].userId },
      });
      result.participants[i].avatar = userData.avatar;
      result.participants[i].userName = userData.userName;
      result.participants[i].email = userData.email;
    }
    // console.log(result);
    this.server.emit('receive-groupData', result);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    await this.usersRepository
      .createQueryBuilder('users')
      .update<AuthorizationEntity>(AuthorizationEntity, {
        ...user,
        isOnline: false,
      })
      .where({ id: userId })
      .execute();
    const res = await this.usersRepository.findOne({
      where: { id: userId },
    });
    this.server.emit('receive-userData', res);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client}`);
  }
}
