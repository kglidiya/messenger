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
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, Observable } from 'rxjs';

import { MessagesEntity } from './messages/messages.entity';
import { IMessageStatus, Message, RoomId } from './interfaces';
import { read } from 'fs';
import { AuthorizationEntity } from './authorization/authorization.entity';
import { RoomsEntity } from './rooms/rooms.entity';
// let prevMessage: string;
// let chunk = '';
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
    // console.log(data);
    client.join(data.roomId);
    // this.server.to(data.roomId).emit('meeting', `in a room ${data.roomId}`);
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
  async handleMessage(client: Socket, payload: any): Promise<void> {
    const recipientsCount = payload.recipientUserId.split(',').length;

    const user =
      recipientsCount === 1
        ? await this.usersRepository.findOne({
            where: { id: payload.recipientUserId },
          })
        : null;
    // console.log(payload);
    // const recipientsCount = payload.recipientUserId.split(',').length;
    // console.log(recipientsCount);
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
    // if (createNewMsg.status !== IMessageStatus.READ) {
    //   await this.msgRepository.increment(
    //     { id: payload.messageId },
    //     'unreadCount',
    //     1,
    //   );
    // }
    const result = await this.msgRepository.save(createNewMsg);
    this.server.emit(
      result.isForwarded ? 'forward-message' : 'receive-message',
      result,
    );
  }

  @SubscribeMessage('send-file')
  async handleFile(client: Socket, payload: any): Promise<void> {
    const result = await this.msgRepository.findOne({
      where: { id: payload.id },
    });
    this.server.emit('receive-file', result);
  }

  @SubscribeMessage('react-to-message')
  async handleReactions(client: Socket, payload: any): Promise<void> {
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
    // console.log(res);
    this.server.to(payload.roomId).emit('receive-reaction', res);
  }

  @SubscribeMessage('delete-reaction')
  async deleteReaction(client: Socket, payload: any): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });
    // const reaction = {
    //   reaction: payload.reaction,
    //   from: payload.from,
    // };
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
    // console.log(res);
    this.server.to(payload.roomId).emit('receive-reaction', res);
  }

  @SubscribeMessage('update-message-status')
  async handleMessageStatusChange(client: Socket, payload: any): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });

    const room = await this.roomsRepository.findOne({
      where: { id: payload.roomId },
    });
    // console.log('payload', payload);
    // console.log('room.usersId', room.usersId);
    // console.log('message.readBy', message.readBy);
    await this.msgRepository
      .createQueryBuilder('messages')
      .update<MessagesEntity>(MessagesEntity, {
        ...message,
        status:
          message.readBy.length < room.usersId.split(',').length - 1
            ? // room.usersId
              //   .split(',')
              //   .filter((userId) => message.readBy.includes(userId)).length ===
              // room.usersId.split(',').length - 2
              IMessageStatus.DELIVERED
            : IMessageStatus.READ,
        readBy: [...message.readBy, payload.readBy],
      })
      .where({ id: payload.messageId })
      .execute();
    // await this.msgRepository.decrement(
    //   { id: payload.messageId },
    //   'unreadCount',
    //   1,
    // );
    const res = await this.msgRepository.findOne({
      where: { id: payload.messageId },
      relations: ['contact', 'parentMessage'],
    });
    this.server.to(payload.roomId).emit('receive-message-status', res);
  }

  @SubscribeMessage('delete-message')
  async deleteMessage(client: Socket, payload: any): Promise<void> {
    const message = await this.msgRepository.findOne({
      where: { id: payload.messageId },
    });

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
    // console.log(res);
    this.server.to(payload.roomId).emit('receive-message-deleted', res);
  }

  @SubscribeMessage('update-userData')
  async handleUserState(client: Socket, payload: any): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });
    if (payload.isOnline !== undefined) {
      await this.usersRepository
        .createQueryBuilder('users')
        .update<AuthorizationEntity>(AuthorizationEntity, {
          ...user,
          isOnline: payload.isOnline,
        })
        .where({ id: payload.userId })
        .execute();
    }

    if (payload.userName) {
      await this.usersRepository
        .createQueryBuilder('users')
        .update<AuthorizationEntity>(AuthorizationEntity, {
          ...user,
          userName: payload.userName,
        })
        .where({ id: payload.userId })
        .execute();
    }
    if (payload.avatar) {
      await this.usersRepository
        .createQueryBuilder('users')
        .update<AuthorizationEntity>(AuthorizationEntity, {
          ...user,
          avatar: payload.avatar,
        })
        .where({ id: payload.userId })
        .execute();
    }
    const res = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });
    const { password, recoveryCode, ...rest } = res;
    // console.log(res);
    this.server.emit('receive-userData', rest);
  }

  @SubscribeMessage('update-typingState')
  async handleTyping(client: Socket, payload: any): Promise<void> {
    console.log(payload);
    this.server.to(payload.roomId).emit('receive-typingState', payload);
  }

  @SubscribeMessage('create-chat')
  async createChat(client: Socket, payload: any): Promise<void> {
    // const currentUserId = client.handshake.query.userId;
    // if (payload.usersId.includes(currentUserId)) {
    //   console.log(payload.usersId.includes(currentUserId));
    //   this.server.emit('receive-newChatData', payload.usersId);
    // }
    // console.log(payload);
    this.server.emit('receive-newChatData', payload.usersId);
  }

  @SubscribeMessage('edit-group')
  async editGroup(client: Socket, payload: any): Promise<void> {
    const room = await this.roomsRepository.findOne({
      where: { id: payload.roomId },
    });
    // console.log(payload);
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
    this.server.emit('receive-groupData', result);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    // console.log(client.handshake.query);
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
    // console.log(res);
    this.server.emit('receive-userData', res);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client}`);
  }
}
