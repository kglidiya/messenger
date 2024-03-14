import React from "react";

import styles from "./ContactDetails.module.css";

import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
interface IContactDetailsProps {
  avatar: string;
  email: string;
  username: string;
}
export default function ContactDetails({ avatar, email, username }: IContactDetailsProps) {
  return (
    <ul className={styles.list}>
      <li className={styles.list__item}>
        {avatar ? <img src={avatar} alt='Аватар' className={styles.avatar} /> : <NoAvatar width={200} height={300} />}
      </li>
      <li className={styles.list__item}>{username}</li>
      <li className={styles.list__item}>{email}</li>
      <ShareIcon onClick={() => {}} />
    </ul>
  );
}
