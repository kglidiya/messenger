import { motion } from "framer-motion";
import React from "react";

import styles from "./ContactDetails.module.css";

import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";
interface IContactDetailsProps {
  avatar: string;
  email: string;
  username: string;
  onClick: VoidFunction;
  isPopupDetailsOpen: boolean;
}
export default function ContactDetails({ avatar, email, username, onClick, isPopupDetailsOpen }: IContactDetailsProps) {
  return (
    <motion.ul
      className={styles.list}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPopupDetailsOpen ? 1 : 0, opacity: isPopupDetailsOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <li className={styles.list__item}>
        {avatar ? <img src={avatar} alt='Аватар' className={styles.avatar} /> : <NoAvatar width={200} height={300} />}
      </li>
      <li className={styles.list__item}>{username}</li>
      <li className={styles.list__item}>{email}</li>
      <TrashIcon onClick={() => {}} bottom={22} right={90} width={38} height={38} />
      <ShareIcon onClick={onClick} bottom={20} right={30} width={38} height={38} />
    </motion.ul>
  );
}
