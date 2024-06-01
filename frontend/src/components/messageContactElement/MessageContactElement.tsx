import { findIndex } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";

import styles from "./MessageContactElement.module.css";

import { Context } from "../..";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import { createChat } from "../../utils/api";

interface IMessageContactElementProps {
  avatar: string;
  email: string;
  //   id: string;
  userName: string;
  // contact: any;
  openMessageActionsPopup?: any;
}

const MessageContactElement = observer(
  ({ avatar, email, userName, openMessageActionsPopup }: IMessageContactElementProps) => {
    const store = useContext(Context).user;
    // const [isMenuOpen, setMenuIsOpen] = useState(false);

    // const creatChart = () => {
    //   createChat({ usersId: [contact.id, store.user.id] });
    //   setTimeout(() => {
    //     store.setContacts();
    //     store.setChatingWith(contact);
    //     store.clearMessages();
    //     // setMenuIsOpen(false);
    //     //   setSearchResult([]);
    //   });
    // };
    // console.log(isMenuOpen);
    return (
      <div className={styles.wrapper} onClick={openMessageActionsPopup}>
        {avatar ? <img src={avatar} alt='Аватар' className={styles.avatar} /> : <NoAvatar width={44} height={44} />}
        <div>
          <p className={styles.text}>{email}</p>
          <p className={styles.text}>{userName}</p>
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
  },
);

export default MessageContactElement;
