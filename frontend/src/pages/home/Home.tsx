import { findIndex } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import styles from "./Home.module.css";

import { Context } from "../..";
import Chart from "../../components/chart/Chart";
import SideBar from "../../components/side-bar/SideBar";
import withWebSocket, { SocketContext, SocketProvider } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";
import { IGroupParticipant, IMessage } from "../../utils/types";

const Home = () => {
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isContactsVisible, setIsContactsVisible] = useState(true);

  //   if (socket) {
  //     socket.on("meeting", (data: IMessage) => {
  //       // scrollToBottom();
  //       // console.log(data);
  //       // store.setContacts();
  //     });

  //     socket.on("receive-userData", (user: any) => {
  //       console.log(user);
  //       if (
  //         store.isAuth &&
  //         (findIndex(store.contacts, {
  //           id: user.id,
  //         }) !== -1 ||
  //           user.id === store.user.id)
  //       ) {
  //         store.updateUserData(user);
  //       }
  //     });

  //     socket.on("receive-newChatData", (res: any) => {
  //       if (res.includes(store.user.id)) {
  //         console.log("receive-newChatData", res);
  //         store.setContacts();
  //         // store.setUnreadCount();
  //         store.clearMessages();
  //         // console.log("store.contacts.length;", toJS(store.contacts.length));
  //       }

  //       // setTimeout(() => {
  //       //   // chatWithLastContact();
  //       //   console.log("store.contacts.length;", toJS(store.contacts.length));
  //       // }, 0);
  //     });

  //     // socket.on("receive-groupData", (groupData: any) => {
  //     //   // console.log("receive-groupData", groupData);
  //     //   const participant = groupData.participants.filter((el: IGroupParticipant) => el.userId === store.user.id)[0];
  //     //   // console.log("participant", participant);
  //     //   const isGroupInContacts = store.contacts.findIndex((el: any) => el.chatId === groupData.id) !== -1;
  //     //   if (participant && !participant.isDeleted && isGroupInContacts) {
  //     //     console.log("1");
  //     //     store.updateGroup(groupData);
  //     //   }
  //     //   if (participant && !participant.isDeleted && !isGroupInContacts) {
  //     //     console.log("2");
  //     //     store.clearMessages();
  //     //     store.setContacts();
  //     //   }
  //     //   if (participant && participant.isDeleted && isGroupInContacts) {
  //     //     console.log("3");
  //     //     store.setContacts();
  //     //     store.setChatingWith(null);
  //     //     store.setCurrentRoom(null);
  //     //     store.clearMessages();
  //     //   }
  //     // });
  //   }
  // }, [socket]);
  return (
    <SocketProvider>
      <div className={styles.content}>
        <SideBar
          isLoadingContacts={isLoadingContacts}
          isLoadingMessages={isLoadingMessages}
          isContactsVisible={isContactsVisible}
          setIsContactsVisible={setIsContactsVisible}
        />

        <Chart
          isLoadingMessages={isLoadingMessages}
          setIsLoadingMessages={setIsLoadingMessages}
          isContactsVisible={isContactsVisible}
          setIsContactsVisible={setIsContactsVisible}
          setIsLoadingContacts={setIsLoadingContacts}
        />
      </div>
    </SocketProvider>
  );
};
export default Home;
