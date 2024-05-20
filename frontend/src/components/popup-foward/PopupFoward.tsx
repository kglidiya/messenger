import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import React, { ForwardedRef, useContext, useEffect, useRef, useState } from "react";

import styles from "./PopupFoward.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import Avatar from "../../ui/avatar/Avatar";
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
  const userStore = useContext(Context).user;
  const socket = useContext(SocketContext);
  // const [value, setValue] = useState<string[]>(userStore.forwardTo);
  // const [checked, setChecked] = useState(false);
  const refInput = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: any) => {
    const target = e.target;
    userStore.setSelectedUsers(target.value, target.checked);

    // if (target.checked) {
    //   setValue([...value, target.value]);
    // } else setValue((prev: string[]) => prev.filter((el) => el !== target.value));
    // userStore.setForwardTo(value);
  };
  // useEffect(() => {
  //   // userStore.setForwardTo(value);
  //   // setValue([]);
  //   // console.log(userStore.forwardTo.length);
  //   if (userStore.forwardTo.length === 0) {
  //     // console.log("userStore.forwardTo.length");
  //     refInput.current!.checked = false;
  //   }
  //   // console.log(refInput.current.checked);
  //   // refInput.current.checked = false;
  // }, [userStore.forwardTo.length]);

  //userStore.setForwardTo(value);
  // console.log(refInput.current);
  // console.log(messageToForward);
  // console.log(toJS(userStore.contactToForward));
  const reset = () => {
    const contactIndex = findIndex(userStore.contacts, {
      chatId: userStore.selectedUsers[userStore.selectedUsers.length - 1],
    });
    userStore.setChatingWith(userStore.contacts[contactIndex]);
    userStore.setCurrentRoom(userStore.contacts[contactIndex].chatId);
    userStore.setMessageToForward(null);
    userStore.setContactToForward(null);
    userStore.clearMessages();
    userStore.clearSelectedUsers();
    // if (userStore.currentRoom) {
    //   userStore.setCurrentRoom(null);
    // }
    closeForwardContactPopup();
  };
  const sendMessage = () => {
    // console.log(messageToForward);
    // console.log(toJS(userStore.contactToForward));

    userStore.selectedUsers.forEach((chatId: string) => {
      // console.log(userId);
      const recipientUser = userStore.contacts.filter((contact: any) => contact.chatId === chatId)[0];
      // console.log("recipientUser", toJS(recipientUser));
      if (messageToForward !== null) {
        const message = {
          id: uuidv4(),
          currentUserId: userStore.user.id,
          recipientUserId: recipientUser.email ? recipientUser.id : chatId,
          message: messageToForward.message,
          contact: messageToForward.contact,
          file: messageToForward.file,
          roomId: chatId,
          readBy: userStore.user.id,
          isForwarded: true,
        };
        // console.log("message", message);
        socket && socket.emit("send-message", message);
      }
      if (contactToForward !== null) {
        const message = {
          id: uuidv4(),
          currentUserId: userStore.user.id,
          recipientUserId: recipientUser.email ? recipientUser.id : chatId,
          message: "",
          contact: contactToForward,
          readBy: userStore.user.id,
          roomId: chatId,
        };
        socket && socket.emit("send-message", message);
      }

      //   try {
      //     const roomId = await connectToChat({
      //       currentUserId: userStore.user.id,
      //       recipientUserId: userId,
      //     });
      //     if (messageToForward !== null) {
      //       const message = {
      //         id: uuidv4(),
      //         currentUserId: userStore.user.id,
      //         recipientUserId: userStore.chatingWith.groupId ? roomId : userId,
      //         message: messageToForward.message,
      //         contact: messageToForward.contact,
      //         file: messageToForward.file,
      //         roomId: roomId,
      //         readBy: userStore.user.id,
      //         isForwarded: true,
      //       };

      //       socket && socket.emit("send-message", message);
      //     }
      //     if (contactToForward !== null) {
      //       const message = {
      //         id: uuidv4(),
      //         currentUserId: userStore.user.id,
      //         recipientUserId: userStore.chatingWith.groupId ? roomId : userId,
      //         message: "",
      //         contact: contactToForward,
      //         readBy: userStore.user.id,
      //         roomId: roomId,
      //       };
      //       socket && socket.emit("send-message", message);
      //     }

      //     // const contactIndex = findIndex(userStore.contacts, { id: userStore.forwardTo[0] });
      //     // userStore.setChatingWith(userStore.contacts[contactIndex]);
      //     // setTimeout(() => {
      //     //   // userStore.setChatingWith(userStore.contacts[contactIndex]);
      //     //   reset();
      //     // }, 0);
      //   } catch (e) {
      //     console.log(e);
      //   }
      // };

      // connectToRoom();
    });
    setTimeout(() => {
      reset();
    }, 0);
  };

  //   // console.log(toJS(userStore.contactToForward));

  //   userStore.forwardTo.forEach((userId: string) => {
  //     // console.log(userId);
  //     const connectToRoom = async () => {
  //       try {
  //         const roomId = await connectToChart({
  //           currentUserId: userStore.user.id,
  //           recipientUserId: userId,
  //         });
  //         if (messageToForward !== null) {
  //           // console.log(messageToForward);
  //           // console.log(toJS(userStore.contactToForward));
  //           const message = {
  //             id: uuidv4(),
  //             currentUserId: userStore.user.id,
  //             recipientUserId: userId,
  //             message: messageToForward.message,
  //             contact: messageToForward.contact,
  //             file: messageToForward.file,
  //             roomId: roomId,
  //             isForwarded: true,
  //           };
  //           // console.log(message);
  //           socket && socket.emit("send-message", message);
  //           userStore.updateRooms(roomId, message.id);
  //         }
  //         if (contactToForward !== null) {
  //           // console.log(toJS(userStore.contactToForward));
  //           const message = {
  //             id: uuidv4(),
  //             currentUserId: userStore.user.id,
  //             recipientUserId: userId,
  //             message: "",
  //             contact: contactToForward,
  //             roomId: roomId,
  //           };
  //           socket && socket.emit("send-message", message);
  //           userStore.updateRooms(roomId, message.id);
  //         }

  //         // const contactIndex = findIndex(userStore.contacts, { id: userStore.forwardTo[0] });
  //         // userStore.setChatingWith(userStore.contacts[contactIndex]);
  //         // setTimeout(() => {
  //         //   // userStore.setChatingWith(userStore.contacts[contactIndex]);
  //         //   reset();
  //         // }, 0);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };

  //     connectToRoom();
  //   });
  //   setTimeout(() => {
  //     reset();
  //   }, 0);
  // };
  // console.log(user);
  // console.log(toJS(userStore.contacts));
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
      <p className={styles.title}>Переслать</p>
      <ShareIcon onClick={sendMessage} width={32} height={32} top={15} right={20} />
      <ul className={styles.list}>
        {userStore.contacts.map((contact: any) => {
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