import { findIndex } from "lodash";
import React, { useContext, useState } from "react";

import styles from "./MessageContactElement.module.css";

import { Context } from "../..";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import { createChat } from "../../utils/api";

interface IMessageContactElementProps {
  //   avatar: string;
  //   email: string;
  //   id: string;
  //   userName: string;
  contact: any;
  openMessageActionsPopup?: any;
}

export default function MessageContactElement({ contact, openMessageActionsPopup }: IMessageContactElementProps) {
  const userStore = useContext(Context).user;
  // const [isMenuOpen, setMenuIsOpen] = useState(false);

  // const creatChart = () => {
  //   createChat({ usersId: [contact.id, userStore.user.id] });
  //   setTimeout(() => {
  //     userStore.setContacts();
  //     userStore.setChatingWith(contact);
  //     userStore.clearMessages();
  //     // setMenuIsOpen(false);
  //     //   setSearchResult([]);
  //   });
  // };
  // console.log(isMenuOpen);
  return (
    <div className={styles.wrapper} onClick={openMessageActionsPopup}>
      {contact.avatar ? (
        <img src={contact.avatar} alt='Аватар' className={styles.avatar} />
      ) : (
        <NoAvatar width={44} height={44} />
      )}
      <div>
        <p className={styles.text}>{contact.email}</p>
        <p className={styles.text}>{contact.userName}</p>
      </div>
      {/* {isMenuOpen && (
        <>
          <p className={styles.menu} onClick={creatChart}>
            Добавить в контакты
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuIsOpen(false);
            }}
          >
            x
          </button>
        </>
      )} */}
    </div>
  );
}