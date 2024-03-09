import React from "react";

import styles from "./Contact.module.css";

import Counter from "../../ui/counter/Counter";

interface IContactProps {
  name: string;
  avatar: string;
  message: string;
  timeStamp: string;
  unread: number;
}

export default function Contact({ name, avatar, message, timeStamp, unread }: IContactProps) {
  return (
    <article className={styles.wrapper}>
      <img src={avatar} alt='аватар' className={styles.avatar} />
      <div className={styles.text}>
        <p className={styles.name}>{name}</p>
        <p className={styles.timeStamp}>{timeStamp}</p>
        <p className={styles.message}> {message}</p>
        {unread > 0 && <Counter messages={unread} />}
      </div>
    </article>
  );
}
