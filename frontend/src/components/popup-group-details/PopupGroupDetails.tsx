/* eslint-disable array-callback-return */
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";

import styles from "./PopupGroupDetails.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import AppStore from "../../store/AppStore";
import Avatar from "../../ui/avatar/Avatar";
import ButtonSend from "../../ui/button-send/ButtonSend";
import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import PlaneIcon from "../../ui/icons/plane/PlaneIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";
import LoaderButton from "../../ui/loaders/loader-button/LoaderButton";
import { isAllContactsInTheGroup } from "../../utils/helpers";
import { IGroupParticipant } from "../../utils/types";
import GroupContact from "../group-contact/GroupContact";
import ProfilePhoto from "../profile-photo/ProfilePhoto";

interface IPopupGroupDetailsProps {
  isPopupDetailsOpen: boolean;
  closeDetailsPopup: VoidFunction;
}
const PopupGroupDetails = observer(({ isPopupDetailsOpen, closeDetailsPopup }: IPopupGroupDetailsProps) => {
  const store = useContext(Context)?.store as AppStore;
  const socket = useContext(SocketContext);
  const isAdmin = store.currentRoom?.admin.includes(store.user?.id as string);
  const [isAddingParticipants, setIsAddingParticipants] = useState(false);
  const [values, setValues] = useState({
    avatar: store.chatingWith?.avatar,
    groupName: store.chatingWith?.userName,
  });
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setValues({ ...values, groupName: target.value });
  };
  const handleSubmitGroupName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const data = {
      roomId: store.currentRoom?.id,
      groupName: values.groupName,
    };
    socket && socket.emit("edit-group", data);
  };
  useEffect(() => {
    setValues({
      avatar: store.chatingWith?.avatar,
      groupName: store.chatingWith?.userName,
    });
  }, [store.chatingWith]);

  const closePopup = () => {
    setIsAddUserOpen(false);
    store.clearSelectedUsers();
  };
  const refInput = useRef<HTMLInputElement | null>(null);
  const handleChangeInputCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    store.setSelectedUsers(target.value, target.checked);
  };

  const addParticipants = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingParticipants(true);
    const participants = store.selectedUsers.join();
    const users = store.contacts.filter((user) => participants.includes(user.id));
    const newParticipants = users.map((user) => {
      return { userId: user.id, addedOn: Date.now(), isDeleted: false };
    });
    const oldParticipants = store.currentRoom?.participants
      .filter((user) => {
        for (let i = 0; i < newParticipants.length; i++) {
          if (user.userId !== newParticipants[i].userId) {
            return user;
          }
        }
      })
      .map((user) => {
        return { userId: user.userId, addedOn: user.addedOn, isDeleted: user.isDeleted };
      });

    const data = {
      roomId: store.currentRoom?.id,
      usersId: store.currentRoom?.usersId + "," + participants,
      participants: [...(oldParticipants as IGroupParticipant[]), ...newParticipants],
    };
    socket && socket.emit("edit-group", data);
    setTimeout(() => {
      closePopup();
      setIsAddingParticipants(false);
    }, 0);
  };

  const quitGroup = () => {
    if (!isAddingParticipants) {
      const usersIdUpdated = store.currentRoom?.usersId
        .split(",")
        .filter((id: string) => id !== store.user?.id)
        .join();
      const participants = store.currentRoom?.participants.map((user) => {
        if (user.userId === store.user?.id) {
          return { addedOn: user.addedOn, userId: user.userId, isDeleted: true };
        } else return { addedOn: user.addedOn, userId: user.userId, isDeleted: user.isDeleted };
      });
      const admins = isAdmin ? store.currentRoom?.admin.filter((el: string) => el !== store.user?.id) : null;
      const data = admins
        ? {
            roomId: store.currentRoom?.id,
            usersId: usersIdUpdated,
            admin: admins,
            participants: participants,
          }
        : {
            roomId: store.currentRoom?.id,
            usersId: usersIdUpdated,
            participants: participants,
          };

      socket && socket.emit("edit-group", data);
      setTimeout(() => {
        closeDetailsPopup();
        store.setChatingWith(null);
        store.setCurrentRoom(null);
      });
    }
  };
  return (
    <motion.aside
      className={styles.container}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPopupDetailsOpen ? 1 : 0, opacity: isPopupDetailsOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {matchesMobile && (
        <CloseIcon onClick={closeDetailsPopup} width={36} height={36} top={15} right={15} color='#ddd6c7' />
      )}
      {isAdmin ? (
        <form onSubmit={handleSubmitGroupName} id='groupChart'>
          <ProfilePhoto
            avatar={values.avatar as string | null}
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
      ) : store.currentRoom?.avatar ? (
        <img src={store.currentRoom?.avatar} alt='Аватар' className={styles.avatar} />
      ) : (
        <NoAvatar width={matchesMobile ? 120 : 200} height={matchesMobile ? 120 : 200} />
      )}

      <p className={styles.groupName}>{store.currentRoom?.name}</p>

      <ul className={styles.contacts}>
        {store.currentRoom?.participants &&
          store.currentRoom?.participants.map((user) => {
            if (!user.isDeleted) {
              return (
                <li key={user.userId} className={styles.contact}>
                  <GroupContact user={user} />
                </li>
              );
            }
          })}
      </ul>

      {isAdmin &&
        !isAllContactsInTheGroup(store.contacts, store.user?.id as string, store.currentRoom?.usersId as string) && (
          <button
            onClick={() => {
              setIsAddUserOpen(true);
              store.clearSelectedUsers();
            }}
            className={styles.addContactBtn}
          >
            {isAddingParticipants ? <LoaderButton /> : `Добавить участника`}
          </button>
        )}
      {isAdmin &&
        (store.currentRoom?.admin as string[]).length > 1 &&
        (store.currentRoom?.usersId as string).split(",").length > 3 && (
          <button
            onClick={quitGroup}
            className={styles.addContactBtn}
            style={{ cursor: isAddingParticipants ? "auto" : "pointer", opacity: isAddingParticipants ? 0.5 : 1 }}
          >
            Выйти из группы
          </button>
        )}
      {!isAdmin && (store.currentRoom?.usersId as string).split(",").length > 3 && (
        <button
          onClick={quitGroup}
          className={styles.addContactBtn}
          style={{ cursor: isAddingParticipants ? "auto" : "pointer", opacity: isAddingParticipants ? 0.5 : 1 }}
        >
          Выйти из группы
        </button>
      )}
      {isAddUserOpen && (
        <div className={styles.addUserPopup}>
          <CloseIcon onClick={closePopup} width={34} height={34} top={10} right={10} color='white' />
          <form className={styles.contacts} id='selectedUsers' onSubmit={addParticipants}>
            {store.contacts.map((user) => {
              if (user.id !== store.user?.id && user.email && !store.currentRoom?.usersId.includes(user.id)) {
                return (
                  <article key={user.id} className={styles.contacts__item}>
                    <InputCheckbox
                      name={user.id}
                      onChange={handleChangeInputCheckbox}
                      ref={refInput}
                      isPopupForwardOpen={isAddUserOpen}
                    />
                    {user.avatar ? (
                      <Avatar avatar={user.avatar} width={50} height={50} />
                    ) : (
                      <NoAvatar width={50} height={50} />
                    )}
                    <div>
                      <p className={styles.text}> {user.userName}</p>
                      <p className={styles.text}> {user.email}</p>
                    </div>
                  </article>
                );
              }
            })}
            <ButtonSend right={15} bottom={10} />
          </form>
        </div>
      )}
    </motion.aside>
  );
});
export default PopupGroupDetails;
