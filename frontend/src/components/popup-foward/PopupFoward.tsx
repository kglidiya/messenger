/* eslint-disable array-callback-return */
import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { ChangeEvent, useContext, useRef } from "react";

import styles from "./PopupFoward.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import AppStore from "../../store/AppStore";
import Avatar from "../../ui/avatar/Avatar";
import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";

import { encrypt } from "../../utils/helpers";
import { IContact, IMessage } from "../../utils/types";

const { v4: uuidv4 } = require("uuid");

interface IPopupFowardProps {
  currentContactId: string;
  isPopupForwardContact: boolean;
  messageToForward: IMessage | null;
  contactToForward: IContact | null;
  closeForwardContactPopup: VoidFunction;
}

export default function PopupFoward({
  currentContactId,
  isPopupForwardContact,
  messageToForward,
  contactToForward,
  closeForwardContactPopup,
}: IPopupFowardProps) {
  const store = useContext(Context)?.store as AppStore;
  const socket = useContext(SocketContext);
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const refInput = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    store.setSelectedUsers(target.value, target.checked);
  };

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
    closeForwardContactPopup();
  };
  const sendMessage = () => {
    store.selectedUsers.forEach((chatId: string) => {
      const recipientUser = store.contacts.filter((contact) => contact.chatId === chatId)[0];
      if (messageToForward !== null) {
        const message = {
          id: uuidv4(),
          currentUserId: store.user?.id,
          recipientUserId: recipientUser.email ? recipientUser.id : chatId,
          message: encrypt(messageToForward.message),
          contact: messageToForward.contact,
          file: messageToForward.file,
          roomId: chatId,
          readBy: store.user?.id,
          isForwarded: true,
        };

        socket && socket.emit("send-message", message);
      }
      if (contactToForward !== null) {
        const message = {
          id: uuidv4(),
          currentUserId: store.user?.id,
          recipientUserId: recipientUser.email ? recipientUser.id : chatId,
          message: "",
          contact: contactToForward,
          readBy: store.user?.id,
          roomId: chatId,
          isForwarded: true,
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
        {store.contacts.map((contact) => {
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
                  <p className={styles.text}> {contact.userName}</p>
                  <p className={styles.text}> {contact.email}</p>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </motion.div>
  );
}
