import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import React, { useContext, useEffect, useRef, useState } from "react";

import styles from "./PopupGroupDetails.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import Avatar from "../../ui/avatar/Avatar";
import ButtonSend from "../../ui/button-send/ButtonSend";
import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";
import DeleteIcon from "../../ui/icons/delete-icon/DeleteIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import PlaneIcon from "../../ui/icons/plane/PlaneIcon";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";
import { findUserById } from "../../utils/api";
import { findItemById, isAllContactsInTheGroup } from "../../utils/helpers";
import Contact from "../contact/Contact";
import GroupContact from "../group-contact/GroupContact";
import ProfilePhoto from "../profile-photo/ProfilePhoto";
interface IPopupGroupDetailsProps {
  id: string[];
  avatar: string;
  // email: string;
  userName: string;
  onClick: VoidFunction;
  isPopupDetailsOpen: boolean;
  closeDetailsPopup: VoidFunction;
}
export default function PopupGroupDetails({
  id,
  avatar,
  // email,
  userName,
  onClick,
  isPopupDetailsOpen,
  closeDetailsPopup,
}: IPopupGroupDetailsProps) {
  const userStore = useContext(Context).user;
  const socket = useContext(SocketContext);
  const isAdmin = userStore.currentRoom.admin.includes(userStore.user.id);
  const [values, setValues] = useState({
    // avatar: userStore.currentRoom.avatar,
    // groupName: userStore.currentRoom.name,
    avatar: avatar,
    groupName: userName,
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const handleChange = (e: any) => {
    const target = e.target;
    setValues({ ...values, groupName: target.value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log(values);
    const data = {
      roomId: userStore.currentRoom.id,
      groupName: values.groupName,
      // groupAvatar: values.groupAvatar,
    };
    socket && socket.emit("edit-group", data);
    // setTimeout(() => {
    //   setMenuIsOpen(false);
    // }, 0);
  };
  // console.log("isAdmin", isAdmin);
  // console.log("isAdmin", userStore.currentRoom.admin.includes(userStore.user.id));
  // console.log("userStore.currentRoom.admin", toJS(userStore.currentRoom.admin));
  // console.log("user", toJS(userStore.user.id));
  // console.log(toJS(userStore.roomAll));
  // console.log(participants);
  // console.log(isAdmin && userStore.currentRoom.admin.length > 1);
  // console.log("userStore.currentRoom", toJS(userStore.currentRoom));
  // console.log(values);
  const closePopup = () => {
    setIsAddUserOpen(false);
    userStore.clearSelectedUsers();
  };
  const refInput = useRef<HTMLInputElement | null>(null);
  const handleChangeInputCheckbox = (e: any) => {
    const target = e.target;
    // console.log(target.value);
    userStore.setSelectedUsers(target.value, target.checked);
  };
  // console.log(toJS(userStore.forwardTo));
  const addParticipants = (e: any) => {
    // e.stopPropagation();
    // console.log(toJS(userStore.forwardTo));
    const participants = userStore.selectedUsers.join();
    const users = userStore.contacts.filter((user: any) => participants.includes(user.id));
    const newParticipants = users.map((user: any) => {
      return { userId: user.id, addedOn: Date.now(), isDeleted: false };
    });
    // const oldParticipants = [...userStore.currentRoom.participants];
    const oldParticipants = userStore.currentRoom.participants
      .filter((user: any) => {
        for (let i = 0; i < newParticipants.length; i++) {
          if (user.userId !== newParticipants[i].userId) {
            return user;
          }
        }
      })
      .map((user: any) => {
        return { userId: user.userId, addedOn: user.addedOn, isDeleted: user.isDeleted };
      });
    // console.log("participantsUpdated", toJS(participantsUpdated));
    // console.log("newParticipants", newParticipants);
    const data = {
      roomId: userStore.currentRoom.id,
      usersId: userStore.currentRoom.usersId + "," + participants,
      participants: [...oldParticipants, ...newParticipants],
    };
    // console.log(data);
    socket && socket.emit("edit-group", data);
    setTimeout(() => {
      closePopup();
    }, 0);
  };

  const addAdmin = (userId: string) => {
    // e.stopPropagation();
    console.log(userId);
    // const participants = userStore.forwardTo.join();
    // console.log(e.target.nodeName);
    const andmins = [...userStore.currentRoom.admin, userId];
    const data = {
      roomId: userStore.currentRoom.id,
      admin: andmins,
    };
    // console.log(data);
    socket && socket.emit("edit-group", data);
    // setTimeout(() => {
    //   closePopup();
    // }, 0);
  };

  const quitGroup = () => {
    // e.stopPropagation();
    // console.log(toJS(userStore.forwardTo));
    const usersIdUpdated = userStore.currentRoom.usersId
      .split(",")
      .filter((id: string) => id !== userStore.user.id)
      .join();
    const participants = userStore.currentRoom.participants.map((user: any) => {
      if (user.userId === userStore.user.id) {
        return { addedOn: user.addedOn, userId: user.userId, isDeleted: true };
      } else return { addedOn: user.addedOn, userId: user.userId, isDeleted: user.isDeleted };
    });
    const admins = isAdmin ? userStore.currentRoom.admin.filter((el: string) => el !== userStore.user.id) : null;
    // console.log(e.target.nodeName);
    const data = admins
      ? {
          roomId: userStore.currentRoom.id,
          usersId: usersIdUpdated,
          admin: admins,
          participants: participants,
        }
      : {
          roomId: userStore.currentRoom.id,
          usersId: usersIdUpdated,
          participants: participants,
        };
    //console.log("admins", admins);
    socket && socket.emit("edit-group", data);
    setTimeout(() => {
      closeDetailsPopup();
      // userStore.setContacts();
      userStore.setChatingWith(null);
      userStore.setCurrentRoom(null);
    });

    // socket && socket.emit("edit-group", data);
  };
  // console.log('userStore.currentRoom.usersId.split(",").length', userStore.currentRoom.usersId.split(",").length);
  return (
    <motion.aside
      className={styles.list}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPopupDetailsOpen ? 1 : 0, opacity: isPopupDetailsOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {isAdmin ? (
        <form onSubmit={handleSubmit}>
          <ProfilePhoto
            // id={userStore.chatingWith.id}
            avatar={values.avatar}
            setValue={setValues}
            isGroupEditOpen={isPopupDetailsOpen}
            values={values}
          />
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type='text'
              placeholder='Название группы'
              value={values.groupName || ""}
              onChange={handleChange}
              name='groupName'
            />

            <button className={styles.buttonSend}>
              <PlaneIcon />
            </button>
          </div>
        </form>
      ) : userStore.currentRoom.avatar ? (
        <img src={userStore.currentRoom.avatar} alt='Аватар' className={styles.avatar} />
      ) : (
        <NoAvatar width={200} height={200} />
      )}

      {/* {!isAdmin && avatar ? (
          <img src={avatar} alt='Аватар' className={styles.avatar} />
        ) : (
          <NoAvatar width={200} height={200} />
        )} */}

      <p className={styles.groupName}>{userStore.currentRoom.name}</p>

      {/* <ul>
          {participants.length > 0 &&
            participants.map((user: any) => {
              return <Contact user={user} unread={0} />;
            })}
        </ul> */}
      <ul className={styles.contacts}>
        {userStore.currentRoom.participants &&
          userStore.currentRoom.participants.map((user: any) => {
            // console.log(findItemById(userStore.contacts, userId)[0]);
            if (!user.isDeleted) {
              return (
                <li key={user.userId} className={styles.contact}>
                  <GroupContact user={user} />
                  {/* {userStore.currentRoom.admin.findIndex((el: any) => el === user.id) === -1 && (
                      <button onClick={() => addAdmin(user.id)} className={styles.addToAdminButton}>
                        Добавить в admin
                      </button>
                    )} */}
                </li>
              );
            }
          })}
      </ul>

      {/* && userStore.chatingWith.participants.length <= userStore.contacts.length - 1 && */}
      {isAdmin && !isAllContactsInTheGroup(userStore.contacts, userStore.user.id, userStore.currentRoom.usersId) && (
        <button
          onClick={() => {
            setIsAddUserOpen(true);
          }}
          className={styles.addContactBtn}
        >
          Добавить участника
        </button>
      )}
      {isAdmin && userStore.currentRoom.admin.length > 1 && userStore.currentRoom.usersId.split(",").length > 3 && (
        <button onClick={quitGroup} className={styles.addContactBtn}>
          Выйти из группы
        </button>
      )}
      {!isAdmin && userStore.currentRoom.usersId.split(",").length > 3 && (
        <button onClick={quitGroup} className={styles.addContactBtn}>
          Выйти из группы
        </button>
      )}
      {isAddUserOpen && (
        <div className={styles.addUserPopup}>
          <CloseIcon onClick={closePopup} width={34} height={34} top={10} right={10} />
          <form className={styles.contacts}>
            {/* <DeleteIcon onClick={() => {}} /> */}

            {userStore.contacts.map((user: any) => {
              if (user.id !== userStore.user.id && !user.groupId && !userStore.currentRoom.usersId.includes(user.id)) {
                return (
                  <article key={user.id} className={styles.contacts__item}>
                    <InputCheckbox
                      name={user.id}
                      onChange={handleChangeInputCheckbox}
                      ref={refInput}
                      isPopupForwardContact={isAddUserOpen}
                    />
                    {user.avatar ? (
                      <Avatar avatar={user.avatar} width={50} height={50} />
                    ) : (
                      <NoAvatar width={50} height={50} />
                    )}
                    <div className={styles.details}>
                      <p> {user.username}</p>
                      <p> {user.email}</p>
                    </div>
                  </article>
                );
              }
            })}
          </form>
          <ButtonSend onClick={addParticipants} right={15} bottom={10} />
        </div>
      )}

      {/* <TrashIcon onClick={() => {}} bottom={22} right={90} width={38} height={38} />
      <ShareIcon onClick={onClick} bottom={20} right={30} width={38} height={38} /> */}
    </motion.aside>
  );
}
