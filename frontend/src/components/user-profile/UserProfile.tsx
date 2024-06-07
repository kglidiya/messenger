/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Socket } from "socket.io-client";

import styles from "./UserProfile.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import AppStore from "../../store/AppStore";
import Avatar from "../../ui/avatar/Avatar";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import ExitIcon from "../../ui/icons/exit-icon/ExitIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import PlaneIcon from "../../ui/icons/plane/PlaneIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";
import { createChat } from "../../utils/api";
import { deleteCookie } from "../../utils/cookies";
import { IUser } from "../../utils/types";
import ProfilePhoto from "../profile-photo/ProfilePhoto";

const UserProfile = observer(
  ({ isMenuOpen, setMenuIsOpen }: { isMenuOpen: boolean; setMenuIsOpen: Dispatch<SetStateAction<boolean>> }) => {
    const store = useContext(Context)?.store as AppStore;
    const socket = useContext(SocketContext) as Socket;
    const navigate = useNavigate();
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [values, setValues] = useState({ avatar: store.user?.avatar, userName: store.user?.userName });
    const [groupData, setGroupData] = useState({ usersId: "", name: "", admin: [] });
    const refInput = useRef<HTMLInputElement | null>(null);

    const toggleProfileEdit = () => {
      if (isGroupEditOpen) {
        setIsGroupEditOpen(false);
        setErrorMsg("");
      }
      setIsProfileEditOpen(!isProfileEditOpen);
    };

    const toggleGroupEdit = () => {
      if (isProfileEditOpen) {
        setIsProfileEditOpen(false);
      }
      if (!isProfileEditOpen) {
        store.clearSelectedUsers();
        setErrorMsg("");
      }
      setIsGroupEditOpen(!isGroupEditOpen);
    };

    useEffect(() => {}, [store.selectedUsers.length]);
    const logOut = () => {
      const data = {
        userId: store.user?.id,
        isOnline: false,
      };
      socket && socket.emit("update-userData", data);
      socket.disconnect();
      store.setUser(null);
      store.setAuth(false);
      store.setChatingWith(null);
      store.clearContacts();
      store.clearMessages();
      store.clearUnreadCount();
      store.setCurrentRoom(null);
      store.setRoomId(null);
      deleteCookie("token");
      localStorage.removeItem("token");
      localStorage.removeItem("expires_on");
      setTimeout(() => {
        navigate("/signin");
      }, 0);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      setValues({ ...values, userName: target.value });
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data = {
        userId: store.user?.id,
        userName: values.userName,
      };
      socket && socket.emit("update-userData", data);
      setTimeout(() => {
        setMenuIsOpen(false);
      }, 0);
    };

    useEffect(() => {
      socket &&
        socket.on("receive-userData", (user: IUser) => {
          if (
            findIndex(store.contacts, {
              id: user.id,
            }) !== -1
          ) {
            store.updateUserData(user);
          }
        });
    }, []);

    useEffect(() => {
      setValues({ ...values, avatar: store.user?.avatar });
    }, [store.user?.avatar]);

    useEffect(() => {
      if (!isMenuOpen) {
        setIsProfileEditOpen(false);
        setIsGroupEditOpen(false);
        setGroupData({ ...groupData, name: "" });
        setErrorMsg("");
      }
    }, [isMenuOpen]);

    const handleChangeInputCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      store.setSelectedUsers(target.value, target.checked);
    };

    const handleGropNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      setGroupData({ ...groupData, name: target.value });
    };

    const handleSubmitGroupData = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!groupData.name) {
        setErrorMsg("Укажите название!");
      }
      if (groupData.name && store.selectedUsers.length > 1) {
        const users = store.contacts.filter((user) => store.selectedUsers.includes(user.id));
        const participants = users.map((user) => {
          return { userId: user.id, addedOn: Date.now(), isDeleted: false };
        });
        try {
          const chat = await createChat({
            usersId: [...(store.selectedUsers as string[]), store.user?.id as string],
            name: groupData.name,
            admin: [store.user?.id as string],
            participants: [
              ...participants,
              { userId: store.user?.id as string, addedOn: Date.now(), isDeleted: false },
            ],
          });

          setTimeout(() => {
            if (chat) {
              socket && socket.emit("create-chat", chat);
            }
            store.setContacts(undefined);
            setMenuIsOpen(false);
          }, 0);
        } catch (e: any) {
          console.log(e);
        }
      }
    };

    return (
      <motion.div
        className={styles.wrapper}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isMenuOpen ? 1 : 0, opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ul className={styles.list}>
          <li onClick={logOut} className={styles.list__item}>
            Выйти <ExitIcon />
          </li>

          <li className={styles.list__item} onClick={toggleProfileEdit}>
            Редактировать профиль <EditIcon color='#ddd6c7' />
          </li>
          {isProfileEditOpen && (
            <motion.li
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isProfileEditOpen ? "auto" : 0,
                opacity: isProfileEditOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={styles.list__item}
            >
              <motion.form
                onSubmit={handleSubmit}
                className={styles.form}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isProfileEditOpen ? "auto" : 0,
                  opacity: isProfileEditOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <ProfilePhoto
                  avatar={values.avatar as string | null}
                  setValue={setValues}
                  isProfileEditOpen={isProfileEditOpen}
                  values={values}
                />
                <div className={styles.inputContainer}>
                  <input
                    className={styles.input}
                    type='text'
                    placeholder='Ваше имя'
                    value={values.userName || ""}
                    onChange={handleChange}
                    name='userName'
                  />

                  <button className={styles.buttonSend}>
                    <PlaneIcon />
                  </button>
                </div>
              </motion.form>
            </motion.li>
          )}
          <li className={styles.list__item} onClick={toggleGroupEdit}>
            Создать группу
          </li>
          {isGroupEditOpen && (
            <motion.li
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isGroupEditOpen ? "auto" : 0,
                opacity: isGroupEditOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={styles.list__item}
            >
              <form onSubmit={handleSubmitGroupData} className={styles.form}>
                <p className={styles.warning}>Выберите не менее 2 участников</p>
                <motion.ul
                  className={styles.contacts}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: isGroupEditOpen ? "auto" : 0,
                    opacity: isGroupEditOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {store.contacts.map((user) => {
                    if (user.id !== store.user?.id && user.email) {
                      return (
                        <li key={user.id} className={styles.contacts__item}>
                          <InputCheckbox
                            name={user.id}
                            onChange={handleChangeInputCheckbox}
                            ref={refInput}
                            isPopupForwardContact={isGroupEditOpen}
                          />
                          {user.avatar ? (
                            <Avatar avatar={user.avatar} width={50} height={50} />
                          ) : (
                            <NoAvatar width={50} height={50} />
                          )}
                          <div>
                            <p className={styles.details}> {user.userName}</p>
                            <p className={styles.details}> {user.email}</p>
                          </div>
                        </li>
                      );
                    }
                  })}
                </motion.ul>
                <div className={styles.inputContainer}>
                  <input
                    className={styles.input}
                    type='text'
                    placeholder={!errorMsg ? "Название группы" : errorMsg}
                    value={groupData.name || ""}
                    onChange={handleGropNameChange}
                    name='name'
                  />

                  <button className={styles.buttonSend}>
                    <PlaneIcon />
                  </button>
                </div>
              </form>
            </motion.li>
          )}
        </ul>
      </motion.div>
    );
  },
);

export default UserProfile;
