import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoomsEntity } from './rooms.entity';
import { GroupData, RoomData } from './interfaces';
import { AuthorizationEntity } from '../authorization/authorization.entity';
import { v4 as uuidv4 } from 'uuid';
import { MessagesEntity } from 'src/messages/messages.entity';
import { IMessageStatus } from 'src/interfaces';
import { group } from 'console';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsEntity)
    private readonly roomsRepository: Repository<RoomsEntity>,
    @InjectRepository(AuthorizationEntity)
    private readonly usersRepository: Repository<AuthorizationEntity>,
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
  ) {}

  async connectToRoom(roomData: RoomData): Promise<any> {
    // console.log('roomData)', roomData);
    if (roomData.currentUserId && roomData.recipientUserId) {
      const ids = roomData.currentUserId
        .concat(',' + roomData.recipientUserId)
        .split(',');

      const uniqueChars = [...new Set(ids)];
      const findDuplicateRoom = await this.roomsRepository
        .createQueryBuilder('rooms')
        .where('rooms.usersId = :ids', {
          // ids: `${ids[0]},${ids[1]}`,
          ids: uniqueChars.sort().join(),
        })
        .getOne();
      // console.log('findDuplicateRoom,', findDuplicateRoom);
      return findDuplicateRoom.id;
    }
  }

  async createGroupChat(groupData: GroupData): Promise<RoomsEntity> {
    console.log(groupData);
    const id = uuidv4();
    const ids = groupData.usersId.sort();
    if (!groupData.name) {
      const newPrivateGroup = {
        usersId: `${ids}`,
        name: 'private',
        admin: [],
      };
      const group = this.roomsRepository.create(newPrivateGroup);
      await this.roomsRepository.save({ ...group, id });
      return group;
    } else {
      const newGroup = {
        usersId: `${ids}`,
        name: groupData.name,
        admin: groupData.admin,
        participants: groupData.participants,
      };
      const group = this.roomsRepository.create(newGroup);
      await this.roomsRepository.save({ ...group, id });
      return group;
    }
    // const findDuplicateGroup = await this.roomsRepository.findOne({
    //   where: { usersId: `${ids}`, name: groupData.name },
    // });
    // if (findDuplicateGroup) {
    //   return findDuplicateGroup;
    // } else {
    //   if (!groupData.name) {
    //     const newPrivateGroup = {
    //       usersId: `${ids}`,
    //       name: 'private',
    //       admin: [],
    //     };
    //     const group = this.roomsRepository.create(newPrivateGroup);
    //     await this.roomsRepository.save({ ...group, id });
    //     return group;
    //   } else {
    //     const newGroup = {
    //       usersId: `${ids}`,
    //       name: groupData.name,
    //       admin: groupData.admin,
    //       participants: groupData.participants,
    //     };
    //     const group = this.roomsRepository.create(newGroup);
    //     await this.roomsRepository.save({ ...group, id });
    //     return group;
    //   }
    // }
  }

  async getAllGroups(userId: string): Promise<any[]> {
    const groups = [];
    const contacts = [];
    const allGroups = await this.roomsRepository.find();
    // console.log('allGroups', allGroups);
    allGroups.forEach((el) => {
      // if (el.usersId.includes(userId) && el.name !== 'private') {
      if (el.usersId.includes(userId)) {
        groups.push(el);
      }
    });
    // console.log(groups);
    // const id = uuidv4();
    for (const group of groups) {
      const msg = await this.messageRepository.find({
        where: { roomId: group.id },
        order: { createdAt: 'DESC' },
      });
      let lastMessageId;
      let firstMessageId;
      const unreadMessages = [];
      if (msg.length) {
        lastMessageId = msg[0].id;
        firstMessageId = msg[msg.length - 1].id;
      }

      // console.log(msg);
      if (group.name === 'private') {
        const unread = msg.filter((m: any, i: number) => {
          // console.log(m.readBy);
          if (
            // m.status !== IMessageStatus.READ &&
            // m.currentUserId !== userId &&
            !m.readBy.includes(userId) &&
            !m.isDeleted
          ) {
            unreadMessages.push(m.id);
            return m;
          }
        }).length;
        group.unread = unread || 0;
        // t.push({ roomId: String(room.id), unread: unread || 0 });
      } else {
        const unread = msg.filter((m: any, i: number) => {
          const addedToGroupChartOn = group.participants.filter(
            (el) => el.userId === userId,
          )[0].addedOn;
          // console.log(m.readBy.findIndex((i: string) => i === this._user.id) === -1);
          if (
            // m.currentUserId !== userId &&
            m.readBy.findIndex((i: string) => i === userId) === -1 &&
            !m.isDeleted &&
            new Date(m.createdAt).getTime() > addedToGroupChartOn
          ) {
            unreadMessages.push(m.id);
            return m;
          }
        }).length;
        group.unread = unread || 0;
        // t.push({ roomId: room.id, unread: unread || 0 });
      }
      group.messagesTotal = msg.length;
      group.lastMessageId = lastMessageId;
      group.firstMessageId = firstMessageId;
      group.firstUnreadMessage =
        unreadMessages[unreadMessages.length - 1] || null;
    }
    const groupsSorted = groups.sort(
      (a, b) => b.messagesTotal - a.messagesTotal,
    );
    for (const group of groupsSorted) {
      const usersId = group.usersId.split(',');
      const groupData = {
        id: group.usersId,
        userName: group.name,
        chatId: group.id,
      };
      for (let i = 0; i < usersId.length; i++) {
        if (usersId[i] != userId && group.name === 'private') {
          const userData = await this.usersRepository.findOne({
            where: { id: usersId[i] },
          });

          const { recoveryCode, password, createdAt, ...rest } = userData;
          contacts.push({ ...rest, chatId: group.id });
        } else if (usersId[i] === userId && group.name !== 'private') {
          contacts.push({
            ...groupData,
            avatar: group.avatar ? group.avatar : null,
          });
        }
      }
      if (group.name !== 'private') {
        for (let i = 0; i < group.participants.length; i++) {
          const userData = await this.usersRepository.findOne({
            where: { id: group.participants[i].userId },
          });
          group.participants[i].avatar = userData.avatar;
          group.participants[i].userName = userData.userName;
          group.participants[i].email = userData.email;
        }
      }
    }

    return [contacts, groupsSorted];
  }

  async getOneGroup(id: string, userId: string): Promise<any> {
    const res = {} as any;
    const group = await this.roomsRepository.findOne({ where: { id } });
    // console.log('group', group);
    const msg = await this.messageRepository.find({
      where: { roomId: group.id },
      order: { createdAt: 'DESC' },
    });
    // console.log('msg.length', msg.length);
    let lastMessageId;
    let firstMessageId;
    // msg.forEach((m) => console.log(m.id));
    const unreadMessages = [];
    if (msg.length) {
      lastMessageId = msg[0].id;
      firstMessageId = msg[msg.length - 1].id;
    }
    const participantsUpdated = [];
    // console.log(msg);
    if (group.name === 'private') {
      const unread = msg.filter((m: any, i: number) => {
        // console.log(m.readBy);
        if (
          // m.status !== IMessageStatus.READ &&
          // m.currentUserId !== userId &&
          !m.readBy.includes(userId) &&
          !m.isDeleted
        ) {
          unreadMessages.push(m.id);
          return m;
        }
      }).length;
      res.unread = unread || 0;
      // t.push({ roomId: String(room.id), unread: unread || 0 });
    } else {
      // console.log('elfff');
      const unread = msg.filter((m: any, i: number) => {
        const addedToGroupChartOn = group.participants.filter((el) => {
          // console.log('el', el);
          return el.userId === userId;
        })[0].addedOn as any;

        if (
          // m.currentUserId !== userId &&
          m.readBy.findIndex((i: string) => i === userId) === -1 &&
          !m.isDeleted &&
          new Date(m.createdAt).getTime() > addedToGroupChartOn
        ) {
          unreadMessages.push(m.id);
          return m;
        }
      }).length;
      res.unread = unread || 0;

      for (let i = 0; i < group.participants.length; i++) {
        const userData = await this.usersRepository.findOne({
          where: { id: group.participants[i].userId },
        });
        if (group.participants[i].userId === userData.id) {
          participantsUpdated.push({
            ...group.participants[i],
            avatar: userData.avatar,
            userName: userData.userName,
            email: userData.email,
          });
        }
      }
    }
    group.participants = participantsUpdated;
    res.messagesTotal = msg.length;
    res.lastMessageId = lastMessageId;
    res.firstMessageId = firstMessageId;
    res.firstUnreadMessage = unreadMessages[unreadMessages.length - 1] || null;
    // console.log('group.firstUnreadMessage', res.firstUnreadMessage);
    return { ...group, ...res };
  }
}
