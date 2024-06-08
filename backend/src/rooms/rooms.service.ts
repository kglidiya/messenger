/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoomsEntity } from './rooms.entity';
import { GroupData, IAllGroupsResponse, IRoom, RoomData } from './interfaces';
import { AuthorizationEntity } from '../authorization/authorization.entity';
import { v4 as uuidv4 } from 'uuid';
import { MessagesEntity } from 'src/messages/messages.entity';

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

  // async connectToRoom(roomData: RoomData): Promise<any> {
  //   if (roomData.currentUserId && roomData.recipientUserId) {
  //     const ids = roomData.currentUserId
  //       .concat(',' + roomData.recipientUserId)
  //       .split(',');

  //     const uniqueChars = [...new Set(ids)];
  //     const room = await this.roomsRepository
  //       .createQueryBuilder('rooms')
  //       .where('rooms.usersId = :ids', {
  //         ids: uniqueChars.sort().join(),
  //       })
  //       .getOne();
  //     return room.id;
  //   }
  // }

  async createGroupChat(groupData: GroupData): Promise<RoomsEntity> {
    console.log(groupData);
    const ids = groupData.usersId.sort();
    if (!groupData.name) {
      const id = uuidv4();
      const newPrivateGroup = {
        usersId: `${ids}`,
        name: 'private',
        admin: [],
      };
      const group = this.roomsRepository.create(newPrivateGroup);
      await this.roomsRepository.save({ ...group, id });
      return { ...group, id };
    } else {
      const id = uuidv4();
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
  }

  async getAllGroups(userId: string): Promise<IAllGroupsResponse> {
    const groups = [];
    const contacts = [];
    const allGroups = await this.roomsRepository.find();

    allGroups.forEach((el) => {
      if (el.usersId.includes(userId)) {
        groups.push(el);
      }
    });

    for (const group of groups) {
      const msg = await this.messageRepository.find({
        where: { roomId: group.id },
        order: { createdAt: 'DESC' },
      });

      const unreadMessages = [];
      const groupMessagesIds = [];

      if (group.name === 'private') {
        const unread = msg.filter((m) => {
          if (!m.readBy.includes(userId) && !m.isDeleted) {
            unreadMessages.push(m.id);
            return m;
          }
        }).length;
        group.unread = unread || 0;
      } else if (group.name !== 'private') {
        const addedToGroupChartOn = group.participants.filter(
          (el) => el.userId === userId,
        )[0].addedOn;
        const unread = msg.filter((m) => {
          if (new Date(m.createdAt).getTime() > addedToGroupChartOn) {
            groupMessagesIds.push(m.id);
            if (
              !m.isDeleted &&
              m.readBy.findIndex((i: string) => i === userId) === -1
            ) {
              unreadMessages.push(m.id);
              return m;
            }
          }
        }).length;
        group.unread = unread || 0;
      }

      if (group.name === 'private') {
        group.messagesTotal = msg.length;
        group.lastMessageId = (msg.length && msg[0].id) || null;
        group.firstMessageId = (msg.length && msg[msg.length - 1].id) || null;
      } else {
        group.messagesTotal = groupMessagesIds.length;
        group.lastMessageId =
          (groupMessagesIds.length && groupMessagesIds[0]) || null;
        group.firstMessageId =
          (groupMessagesIds.length &&
            groupMessagesIds[groupMessagesIds.length - 1]) ||
          null;
      }

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
        }
      }
      if (group.name !== 'private') {
        contacts.push({
          ...groupData,
          avatar: group.avatar ? group.avatar : null,
        });
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

    return { contacts, rooms: groupsSorted };
  }

  async getOneGroup(id: string, userId: string): Promise<IRoom> {
    const res = {} as any;
    const group = await this.roomsRepository.findOne({ where: { id } });
    const msg = await this.messageRepository.find({
      where: { roomId: group.id },
      order: { createdAt: 'DESC' },
    });

    const unreadMessages = [];
    const groupMessagesIds = [];

    const participantsUpdated = [];

    if (group.name === 'private') {
      const unread = msg.filter((m) => {
        if (!m.readBy.includes(userId) && !m.isDeleted) {
          unreadMessages.push(m.id);
          return m;
        }
      }).length;
      res.unread = unread || 0;
    } else if (group.name !== 'private') {
      const addedToGroupChartOn = group.participants.filter((el) => {
        return el.userId === userId;
      })[0].addedOn as any;

      const unread = msg.filter((m) => {
        if (new Date(m.createdAt).getTime() > addedToGroupChartOn) {
          groupMessagesIds.push(m.id);

          if (
            !m.isDeleted &&
            m.readBy.findIndex((i: string) => i === userId) === -1
          ) {
            unreadMessages.push(m.id);
            return m;
          }
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

    if (group.name === 'private') {
      res.messagesTotal = msg.length;
      res.lastMessageId = (msg.length && msg[0].id) || null;
      res.firstMessageId = (msg.length && msg[msg.length - 1].id) || null;
    } else {
      res.messagesTotal = groupMessagesIds.length;
      res.lastMessageId =
        (groupMessagesIds.length && groupMessagesIds[0]) || null;
      res.firstMessageId =
        (groupMessagesIds.length &&
          groupMessagesIds[groupMessagesIds.length - 1]) ||
        null;
    }
    res.firstUnreadMessage = unreadMessages[unreadMessages.length - 1] || null;
    return { ...group, ...res };
  }
}
