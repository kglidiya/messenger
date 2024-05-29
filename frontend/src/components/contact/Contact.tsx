import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";

import styles from "./Contact.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import Avatar from "../../ui/avatar/Avatar";
import Counter from "../../ui/counter/Counter";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";

interface IContactProps {
  user: any;
  unread: number;
  setIsContactsVisible?: any;
  // id: string;
  // userName: string;
  // avatar: string;
  // message: string;
  // timeStamp: string;
  // unread: number;
  // email: string;
}

// const Contact = observer(({ id, userName, avatar, message, timeStamp, unread, email }: IContactProps) => {
const Contact = observer(({ user, unread, setIsContactsVisible }: IContactProps) => {
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const store = useContext(Context).user;
  const handleContactClick = () => {
    // store.setChatingWith(user);
    // store.clearMessages();
    if (store.chatingWith.chatId !== user.chatId) {
      store.clearMessages();
      store.setChatingWith(user);
      // store.getOneRoom({ roomId: store.currentRoom?.id });
      // store.setCurrentRoom(store.chatingWith.id);
    }
    if (matchesMobile) {
      setIsContactsVisible(false);
    }
    // if (store.chatingWith.groupId) {
    //   store.setCurrentRoom(store.chatingWith.id);
    // } else {
    //   const userIds = [store.user.id, store.chatingWith.id].sort();
    //   store.setCurrentRoom(userIds.join());
    // }
    // store.getOneRoom({ roomId: store.currentRoom?.id });
  };
  // console.log(toJS(store.chatingWith));
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
