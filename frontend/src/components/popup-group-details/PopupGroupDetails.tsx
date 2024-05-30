import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";

import styles from "./PopupGroupDetails.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
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
  // avatar?: string;
  // // email: string;
  // userName?: string;
  // onClick: VoidFunction;
  isPopupDetailsOpen: boolean;
  closeDetailsPopup: VoidFunction;
}
const PopupGroupDetails = observer(
  ({
    // avatar,
    // // email,
    // userName,
    // onClick,
    isPopupDetailsOpen,
    closeDetailsPopup,
  }: IPopupGroupDetailsProps) => {
    const store = useContext(Context).user;
    const socket = useContext(SocketContext);
    const isAdmin = store.currentRoom.admin.includes(store.user.id);
    const [values, setValues] = useState({
      avatar: store.chatingWith.avatar,
      groupName: store.chatingWith.userName,
      // avatar: avatar,
      // groupName: userName,
    });
    const matchesMobile = useMediaQuery("(max-width: 576px)");
    // console.log("store.chatingWith", toJS(store.chatingWith.userName));
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const handleGroupNameChange = (e: any) => {
      const target = e.target;
      setValues({ ...values, groupName: target.value });
    };
    const handleSubmitGroupName = (e: any) => {
      e.preventDefault();
      // console.log(values);
      const data = {
        roomId: store.currentRoom.id,
        groupName: values.groupName,
        // groupAvatar: values.groupAvatar,
      };
      socket && socket.emit("edit-group", data);
      // setTimeout(() => {
      //   setMenuIsOpen(false);
      // }, 0);
    };
    useEffect(() => {
      setValues({
        avatar: store.chatingWith.avatar,
        groupName: store.chatingWith.userName,
        // avatar: avatar,
        // groupName: userName,
      });
    }, [store.chatingWith]);
    // console.log("isAdmin", isAdmin);
    // console.log("isAdmin", store.currentRoom.admin.includes(store.user.id));
    // console.log("store.currentRoom.admin", toJS(store.currentRoom.admin));
    // console.log("user", toJS(store.user.id));
    // console.log(toJS(store.roomAll));
    // console.log(participants);
    // console.log(isAdmin && store.currentRoom.admin.length > 1);
    // console.log("store.currentRoom", toJS(store.currentRoom));
    // console.log(values);
    const closePopup = () => {
      setIsAddUserOpen(false);
      store.clearSelectedUsers();
    };
    const refInput = useRef<HTMLInputElement | null>(null);
    const handleChangeInputCheckbox = (e: any) => {
      const target = e.target;
      // console.log(target.value);
      store.setSelectedUsers(target.value, target.checked);
    };
    // console.log(toJS(store.forwardTo));
    const addParticipants = (e: any) => {
      // e.stopPropagation();
      // console.log(toJS(store.selectedUsers));
      const participants = store.selectedUsers.join();
      const users = store.contacts.filter((user: any) => participants.includes(user.id));
      const newParticipants = users.map((user: any) => {
        return { userId: user.id, addedOn: Date.now(), isDeleted: false };
      });
      // const oldParticipants = [...store.currentRoom.participants];
      const oldParticipants = store.currentRoom.participants
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
      // console.log("participantsUpdated", toJS(oldParticipants));
      // console.log("newParticipants", newParticipants);
      const data = {
        roomId: store.currentRoom.id,
        usersId: store.currentRoom.usersId + "," + participants,
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
      // console.log(userId);
      // const participants = store.forwardTo.join();
      // console.log(e.target.nodeName);
      const andmins = [...store.currentRoom.admin, userId];
      const data = {
        roomId: store.currentRoom.id,
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
      // console.log(toJS(store.forwardTo));
      const usersIdUpdated = store.currentRoom.usersId
        .split(",")
        .filter((id: string) => id !== store.user.id)
        .join();
      const participants = store.currentRoom.participants.map((user: any) => {
        if (user.userId === store.user.id) {
          return { addedOn: user.addedOn, userId: user.userId, isDeleted: true };
        } else return { addedOn: user.addedOn, userId: user.userId, isDeleted: user.isDeleted };
      });
      const admins = isAdmin ? store.currentRoom.admin.filter((el: string) => el !== store.user.id) : null;
      // console.log(e.target.nodeName);
      const data = admins
        ? {
            roomId: store.currentRoom.id,
            usersId: usersIdUpdated,
            admin: admins,
            participants: participants,
          }
        : {
            roomId: store.currentRoom.id,
            usersId: usersIdUpdated,
            participants: participants,
          };
      //console.log("admins", admins);
      socket && socket.emit("edit-group", data);
      setTimeout(() => {
        closeDetailsPopup();
        // store.setContacts();
        store.setChatingWith(null);
        store.setCurrentRoom(null);
      });

      // socket && socket.emit("edit-group", data);
    };
    // console.log('store.currentRoom.usersId.split(",").length', store.currentRoom.usersId.split(",").length);
    return (
      <motion.aside
        className={styles.list}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isPopupDetailsOpen ? 1 : 0, opacity: isPopupDetailsOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {matchesMobile && (
          <CloseIcon onClick={closeDetailsPopup} width={36} height={36} top={15} right={15} color='#ddd6c7' />
        )}
        {isAdmin ? (
          <form onSubmit={handleSubmitGroupName}>
            <ProfilePhoto
              // id={store.chatingWith.id}
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
                onChange={handleGroupNameChange}
                name='groupName'
              />

              <button className={styles.buttonSend}>
                <PlaneIcon />
              </button>
            </div>
          </form>
        ) : store.currentRoom.avatar ? (
          <img src={store.currentRoom.avatar} alt='Аватар' className={styles.avatar} />
        ) : (
          <NoAvatar width={matchesMobile ? 120 : 200} height={matchesMobile ? 120 : 200} />
        )}

        {/* {!isAdmin && avatar ? (
          <img src={avatar} alt='Аватар' className={styles.avatar} />
        ) : (
          <NoAvatar width={200} height={200} />
        )} */}

        <p className={styles.groupName}>{store.currentRoom.name}</p>

        {/* <ul>
          {participants.length > 0 &&
            participants.map((user: any) => {
              return <Contact user={user} unread={0} />;
            })}
        </ul> */}
        <ul className={styles.contacts}>
          {store.currentRoom.participants &&
            store.currentRoom.participants.map((user: any) => {
              // console.log(findItemById(store.contacts, userId)[0]);
              if (!user.isDeleted) {
                return (
                  <li key={user.userId} className={styles.contact}>
                    <GroupContact user={user} />
                    {/* {store.currentRoom.admin.findIndex((el: any) => el === user.id) === -1 && (
                      <button onClick={() => addAdmin(user.id)} className={styles.addToAdminButton}>
                        Добавить в admin
                      </button>
                    )} */}
                  </li>
                );
              }
            })}
        </ul>

        {/* && store.chatingWith.participants.length <= store.contacts.length - 1 && */}
        {isAdmin && !isAllContactsInTheGroup(store.contacts, store.user.id, store.currentRoom.usersId) && (
          <button
            onClick={() => {
              setIsAddUserOpen(true);
              store.clearSelectedUsers();
            }}
            className={styles.addContactBtn}
          >
            Добавить участника
          </button>
        )}
        {isAdmin && store.currentRoom.admin.length > 1 && store.currentRoom.usersId.split(",").length > 3 && (
          <button onClick={quitGroup} className={styles.addContactBtn}>
            Выйти из группы
          </button>
        )}
        {!isAdmin && store.currentRoom.usersId.split(",").length > 3 && (
          <button onClick={quitGroup} className={styles.addContactBtn}>
            Выйти из группы
          </button>
        )}
        {isAddUserOpen && (
          <div className={styles.addUserPopup}>
            <CloseIcon onClick={closePopup} width={34} height={34} top={10} right={10} color='white' />
            <form className={styles.contacts}>
              {/* <DeleteIcon onClick={() => {}} /> */}

              {store.contacts.map((user: any) => {
                if (user.id !== store.user.id && user.email && !store.currentRoom.usersId.includes(user.id)) {
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
                        <p> {user.userName}</p>
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
  },
);
export default PopupGroupDetails;
