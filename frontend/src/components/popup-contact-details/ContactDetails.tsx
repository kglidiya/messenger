import { motion } from "framer-motion";
import React from "react";

import styles from "./ContactDetails.module.css";

import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";
interface IContactDetailsProps {
  // id: string;
  avatar: string;
  email: string;
  userName: string;
  onClick: VoidFunction;
  isPopupDetailsOpen: boolean;
}
export default function ContactDetails({
  // id,
  avatar,
  email,
  userName,
  onClick,
  isPopupDetailsOpen,
}: IContactDetailsProps) {
  return (
    <motion.aside
      className={styles.wrapper}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPopupDetailsOpen ? 1 : 0, opacity: isPopupDetailsOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.avatar}>
        {avatar ? <img src={avatar} alt='Аватар' className={styles.avatar} /> : <NoAvatar width={200} height={300} />}
      </div>
      <div className={styles.userDetails}>
        <div>
          <p className={styles.userName}>{userName}</p>
          <p className={styles.email}>{email}</p>
        </div>

        {/* <TrashIcon onClick={() => {}} bottom={22} right={90} width={38} height={38} /> */}
        <button className={styles.shareContactBtn} onClick={onClick}>
          Поделиться контактом
          <ShareIcon bottom={4} right={5} width={35} height={35} />
        </button>
      </div>

      {/* <ShareIcon onClick={onClick} bottom={20} right={30} width={38} height={38} /> */}
    </motion.aside>
  );
}
