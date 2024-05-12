import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import styles from "./GroupContact.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import Avatar from "../../ui/avatar/Avatar";
import Counter from "../../ui/counter/Counter";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";

interface IContactProps {
  user: any;
  // isAdmin: boolean;
  // id: string;
  // userName: string;
  // avatar: string;
  // message: string;
  // timeStamp: string;
  // unread: number;
  // email: string;
}

// const Contact = observer(({ id, userName, avatar, message, timeStamp, unread, email }: IContactProps) => {
const GroupContact = observer(({ user }: IContactProps) => {
  const socket = useContext(SocketContext);
  const userStore = useContext(Context).user;
  const isAdmin = userStore.currentRoom.admin.includes(userStore.user.id);
  // const activeParticipants = userStore.currentRoom.participants.filter((user: any) => !user.isDeleted).length;

  // // console.log(toJS(userStore.chatingWith));
  // console.log(toJS("activeParticipants", activeParticipants));
  const deleteUser = (userId: string) => {
    const participantsId = userStore.currentRoom.usersId
      .split(",")
      .filter((id: string) => id !== userId)
      .join();

    const participants = userStore.currentRoom.participants.map((user: any) => {
      if (user.userId === userId) {
        return { addedOn: user.addedOn, userId: user.userId, isDeleted: true };
      } else return { addedOn: user.addedOn, userId: user.userId, isDeleted: user.isDeleted };
    });
    // console.log(toJS(participants));
    // console.log("userId", userId);
    const data = {
      roomId: userStore.currentRoom.id,
      usersId: participantsId,
      participants,
      // groupAvatar: values.groupAvatar,
    };
    socket && socket.emit("edit-group", data);
  };

  const addAdmin = (userId: string) => {
    // e.stopPropagation();
    // console.log(userId);
    // const participants = userStore.forwardTo.join();
    // console.log(e.target.nodeName);
    const andmins = [...userStore.currentRoom.admin, userId];
    const data = {
      roomId: userStore.currentRoom.id,
      admin: andmins,
    };
    // console.log(data);
    socket && socket.emit("edit-group", data);
    // setTimeout(() => {
    //   closePopup();
    // }, 0);
  };
  // console.log(user);
  return (
    <>
      {user && (
        <article className={styles.wrapper}>
          {user.avatar ? <Avatar avatar={user.avatar} width={44} height={44} /> : <NoAvatar width={40} height={40} />}
          <div className={styles.details}>
            <div className={styles.nameContainer}>
              {user.email && <p className={styles.name}>{user.email}</p>}
              {user.userName && <p className={styles.name}>{user.userName}</p>}
            </div>
            {userStore.currentRoom.admin.includes(user.userId) && <p className={styles.role}>Admin</p>}
          </div>
          {isAdmin && !userStore.currentRoom.admin.includes(user.userId) && (
            <button onClick={() => addAdmin(user.userId)} className={styles.addToAdminButton}>
              Добавить в admin
            </button>
          )}

          {isAdmin &&
            !userStore.currentRoom.admin.includes(user.userId) &&
            userStore.currentRoom.usersId.split(",").length >= 4 && (
              <TrashIcon
                width={28}
                height={28}
                onClick={() => {
                  deleteUser(user.userId);
                }}
                top={13}
                right={100}
              />
            )}
        </article>
      )}
    </>
  );
});

export default GroupContact;
