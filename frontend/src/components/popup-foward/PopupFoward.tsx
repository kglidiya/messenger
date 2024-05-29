import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import React, { ForwardedRef, useContext, useEffect, useRef, useState } from "react";

import styles from "./PopupFoward.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import Avatar from "../../ui/avatar/Avatar";
import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";
import { connectToChat } from "../../utils/api";
import { findItemById } from "../../utils/helpers";
import { IMessage } from "../../utils/types";

const { v4: uuidv4 } = require("uuid");

interface IPopupFowardProps {
  currentContactId: number;
  isPopupForwardContact: boolean;
  messageToForward: any;
  contactToForward: any;
  closeForwardContactPopup: VoidFunction;
}

export default function PopupFoward({
  currentContactId,
  isPopupForwardContact,
  messageToForward,
  contactToForward,
  closeForwardContactPopup,
}: IPopupFowardProps) {
  const store = useContext(Context).user;
  const socket = useContext(SocketContext);
  // const [value, setValue] = useState<string[]>(store.forwardTo);
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const refInput = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: any) => {
    const target = e.target;
    store.setSelectedUsers(target.value, target.checked);

    // if (target.checked) {
    //   setValue([...value, target.value]);
    // } else setValue((prev: string[]) => prev.filter((el) => el !== target.value));
    // store.setForwardTo(value);
  };
  // useEffect(() => {
  //   // store.setForwardTo(value);
  //   // setValue([]);
  //   // console.log(store.forwardTo.length);
  //   if (store.forwardTo.length === 0) {
  //     // console.log("store.forwardTo.length");
  //     refInput.current!.checked = false;
  //   }
  //   // console.log(refInput.current.checked);
  //   // refInput.current.checked = false;
  // }, [store.forwardTo.length]);

  //store.setForwardTo(value);
  // console.log(refInput.current);
  // console.log(messageToForward);
  // console.log(toJS(store.contactToForward));
  const reset = () => {
    const contactIndex = findIndex(store.contacts, {
      chatId: store.selectedUsers[store.selectedUsers.length - 1],
    });
    store.setChatingWith(store.contacts[contactIndex]);
    store.setCurrentRoom(store.contacts[contactIndex].chatId);
    store.setMessageToForward(null);
    store.setContactToForward(null);
    store.clearMessages();
    store.clearSelectedUsers();
    // if (store.currentRoom) {
    //   store.setCurrentRoom(null);
    // }
    closeForwardContactPopup();
  };
  const sendMessage = () => {
    // console.log(messageToForward);
    // console.log(toJS(store.contactToForward));

    store.selectedUsers.forEach((chatId: string) => {
      // console.log(userId);
      const recipientUser = store.contacts.filter((contact: any) => contact.chatId === chatId)[0];
      // console.log("recipientUser", toJS(recipientUser));
      if (messageToForward !== null) {
        const message = {
          id: uuidv4(),
          currentUserId: store.user.id,
          recipientUserId: recipientUser.email ? recipientUser.id : chatId,
          message: messageToForward.message,
          contact: messageToForward.contact,
          file: messageToForward.file,
          roomId: chatId,
          readBy: store.user.id,
          isForwarded: true,
        };
        // console.log("message", message);
        socket && socket.emit("send-message", message);
      }
      if (contactToForward !== null) {
        const message = {
          id: uuidv4(),
          currentUserId: store.user.id,
          recipientUserId: recipientUser.email ? recipientUser.id : chatId,
          message: "",
          contact: contactToForward,
          readBy: store.user.id,
          roomId: chatId,
        };
        socket && socket.emit("send-message", message);
      }
    });
    setTimeout(() => {
      reset();
    }, 0);
  };

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: isPopupForwardContact ? "auto" : 0,
        opacity: isPopupForwardContact ? 1 : 0,
        transform: isPopupForwardContact ? "translate(-50%, -50%)" : "translate(-50%, -50%)",
      }}
      transition={{ duration: 0.3 }}
    >
      {matchesMobile && (
        <CloseIcon onClick={closeForwardContactPopup} width={34} height={34} top={12} left={10} color='#ddd6c7' />
      )}
      <p className={styles.title}>Переслать</p>
      <ShareIcon onClick={sendMessage} width={32} height={32} top={15} right={20} />
      <ul className={styles.list}>
        {store.contacts.map((contact: any) => {
          // console.log(toJS(contact));
          // return (
          //   <li key={contact.chatId} className={styles.list__item}>
          //     <InputCheckbox
          //       name={contact.chatId}
          //       onChange={handleChange}
          //       ref={refInput}
          //       isPopupForwardContact={isPopupForwardContact}
          //     />
          //     {contact.avatar ? (
          //       <Avatar avatar={contact.avatar} width={50} height={50} />
          //     ) : (
          //       <NoAvatar width={50} height={50} />
          //     )}
          //     <div className={styles.details}>
          //       <p> {contact.userName}</p>
          //       <p> {contact.email}</p>
          //     </div>
          //   </li>
          // );
          if (contact.id !== currentContactId) {
            return (
              <li key={contact.chatId} className={styles.list__item}>
                <InputCheckbox
                  name={contact.chatId}
                  onChange={handleChange}
                  ref={refInput}
                  isPopupForwardContact={isPopupForwardContact}
                />
                {contact.avatar ? (
                  <Avatar avatar={contact.avatar} width={50} height={50} />
                ) : (
                  <NoAvatar width={50} height={50} />
                )}
                <div className={styles.details}>
                  <p> {contact.userName}</p>
                  <p> {contact.email}</p>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </motion.div>
  );
}
