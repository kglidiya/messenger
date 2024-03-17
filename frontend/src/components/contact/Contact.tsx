import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import styles from "./Contact.module.css";

import { Context } from "../..";
import Avatar from "../../ui/avatar/Avatar";
import Counter from "../../ui/counter/Counter";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";

interface IContactProps {
  id: string;
  username: string;
  avatar: string;
  message: string;
  timeStamp: string;
  unread: number;
  email: string;
}

const Contact = observer(({ id, username, avatar, message, timeStamp, unread, email }: IContactProps) => {
  const userStore = useContext(Context).user;
  return (
    <article className={styles.wrapper} onClick={() => userStore.setChatingWith(id)}>
      {avatar ? <Avatar avatar={avatar} width={50} height={50} /> : <NoAvatar width={44} height={44} />}
      <div className={styles.text}>
        <p className={styles.name}>{username ? username : email}</p>
        <p className={styles.timeStamp}>{timeStamp}</p>
        <p className={styles.message}> {message}</p>
        {unread > 0 && <Counter messages={unread} />}
      </div>
    </article>
  );
});

export default Contact;
