import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";

import styles from "./Contact.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import Avatar from "../../ui/avatar/Avatar";
import Counter from "../../ui/counter/Counter";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";

interface IContactProps {
  user: any;
  unread: number;
  // id: string;
  // userName: string;
  // avatar: string;
  // message: string;
  // timeStamp: string;
  // unread: number;
  // email: string;
}

// const Contact = observer(({ id, userName, avatar, message, timeStamp, unread, email }: IContactProps) => {
const Contact = observer(({ user, unread }: IContactProps) => {
  const socket = useContext(SocketContext);
  const userStore = useContext(Context).user;
  const handleContactClick = () => {
    // userStore.setChatingWith(user);
    // userStore.clearMessages();
    if (userStore.chatingWith.chatId !== user.chatId) {
      userStore.clearMessages();
      userStore.setChatingWith(user);
      // userStore.getOneRoom({ roomId: userStore.currentRoom?.id });
      // userStore.setCurrentRoom(userStore.chatingWith.id);
    }

    // if (userStore.chatingWith.groupId) {
    //   userStore.setCurrentRoom(userStore.chatingWith.id);
    // } else {
    //   const userIds = [userStore.user.id, userStore.chatingWith.id].sort();
    //   userStore.setCurrentRoom(userIds.join());
    // }
    // userStore.getOneRoom({ roomId: userStore.currentRoom?.id });
  };
  // console.log(toJS(userStore.chatingWith));
  // console.log(user);
  return (
    <>
      {user && (
        <article className={styles.wrapper} onClick={handleContactClick}>
          {user.avatar ? <Avatar avatar={user.avatar} width={50} height={50} /> : <NoAvatar width={44} height={44} />}
          <div className={styles.details}>
            <div className={styles.userInfo}>
              <p className={styles.name}>{user.userName ? user.userName : user.email}</p>
              {user.email && user.isOnline && <p className={styles.isOnline}>В сети</p>}
              {user.email && !user.isOnline && <p className={styles.isOnline}>Не в сети</p>}
            </div>

            {/* <p className={styles.timeStamp}>{timeStamp}</p>
        <p className={styles.message}> {message}</p> */}
            {unread > 0 && <Counter messages={unread} />}
            {/* <Counter messages={3} /> */}

            {/* <Counter messages={3} /> */}
          </div>
        </article>
      )}
    </>
  );
});

export default Contact;
