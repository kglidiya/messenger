import { motion } from "framer-motion";
import React, { useContext } from "react";

import styles from "./PopupFowardContact.module.css";

import { Context } from "../..";
import Avatar from "../../ui/avatar/Avatar";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";

interface IPopupFowardMessageProps {
  currentContactId: number;
  isPopupForwardContact: boolean;
}

export default function PopupFowardMessage({ currentContactId, isPopupForwardContact }: IPopupFowardMessageProps) {
  const userStore = useContext(Context).user;
  return (
    <motion.div
      className={styles.wrapper}
      animate={{
        height: isPopupForwardContact ? "auto" : 0,
        opacity: isPopupForwardContact ? 1 : 0,
        transform: isPopupForwardContact ? "translate(-50%, -50%)" : "translate(-50%, -50%)",
      }}
      transition={{ duration: 0.3 }}
    >
      <p className={styles.title}>Переслать контакт</p>
      <ShareIcon onClick={() => {}} width={32} height={32} top={15} right={20} />
      <ul className={styles.list}>
        {userStore.contacts.map((user: any) => {
          if (user.id !== currentContactId) {
            return (
              <li key={user.id} className={styles.list__item}>
                <InputCheckbox name={user.id} />
                {user.avatar ? (
                  <Avatar avatar={user.avatar} width={50} height={50} />
                ) : (
                  <NoAvatar width={50} height={50} />
                )}
                <div className={styles.details}>
                  <p> {user.username}</p>
                  <p> {user.email}</p>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </motion.div>
  );
}
