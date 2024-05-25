import { motion } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./UserProfile.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import Avatar from "../../ui/avatar/Avatar";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import ExitIcon from "../../ui/icons/exit-icon/ExitIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import PlaneIcon from "../../ui/icons/plane/PlaneIcon";
import InputCheckbox from "../../ui/input-checkbox/InputCheckbox";
import { createChat } from "../../utils/api";
import { deleteCookie } from "../../utils/cookies";
import ProfilePhoto from "../profile-photo/ProfilePhoto";

const UserProfile = observer(
  ({
    isMenuOpen,
    setMenuIsOpen,
  }: //   avatar,
  //   username,
  {
    isMenuOpen: boolean;
    setMenuIsOpen: any;
    //   avatar: string;
    //   username: string;
  }) => {
    const userStore = useContext(Context).user;
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [usersCount, setUsersCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [values, setValues] = useState({ avatar: userStore.user.avatar, userName: userStore.user.userName });
    const [groupData, setGroupData] = useState({ usersId: "", name: "", admin: [] });
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
        // userStore.setContactToForward(null);
        userStore.clearSelectedUsers();
        setErrorMsg("");
      }
      setIsGroupEditOpen(!isGroupEditOpen);
    };
    // useEffect(() => {
    //   if (groupData.name && userStore.selectedUsers.length > 1) {
    //     setIsDisabled(false);
    //   } else setIsDisabled(true);
    // }, [groupData.name, userStore.selectedUsers.length]);
    useEffect(() => {}, [userStore.selectedUsers.length]);
    const logOut = () => {
      const data = {
        userId: userStore.user.id,
        isOnline: false,
      };
      socket && socket.emit("update-userData", data);
      socket.disconnect();
      userStore.setUser(null);
      userStore.setAuth(false);
      userStore.setChatingWith(null);
      userStore.clearContacts();
      userStore.clearMessages();
      userStore.clearUnreadCount();
      userStore.setCurrentRoom(null);
      userStore.setRoomId(null);
      deleteCookie("token");
      localStorage.removeItem("token");
      localStorage.removeItem("expires_on");
      setTimeout(() => {
        navigate("/signin");
      }, 0);
    };

    const handleChange = (e: any) => {
      const target = e.target;
      setValues({ ...values, userName: target.value });
    };
    const handleSubmit = (e: any) => {
      e.preventDefault();

      const data = {
        userId: userStore.user.id,
        userName: values.userName,
      };
      socket && socket.emit("update-userData", data);
      setTimeout(() => {
        setMenuIsOpen(false);
      }, 0);
    };

    useEffect(() => {
      socket &&
        socket.on("receive-userData", (user: any) => {
          // console.log("userStore.addMessage(message)");

          if (
            findIndex(userStore.contacts, {
              id: user.id,
            }) !== -1
          ) {
            userStore.updateUserData(user);
          }

          //userStore.updateUserData(user);
          // setValues({ ...values, avatar: user.avatar });
          //userStore.setContacts();
        });
    }, []);

    useEffect(() => {
      setValues({ ...values, avatar: userStore.user.avatar });
    }, [userStore.user.avatar]);

    useEffect(() => {
      if (!isMenuOpen) {
        setIsProfileEditOpen(false);
        setIsGroupEditOpen(false);
        setGroupData({ ...groupData, name: "" });
        setErrorMsg("");
      }
    }, [isMenuOpen]);
    const refInput = useRef<HTMLInputElement | null>(null);
    const handleChangeInputCheckbox = (e: any) => {
      const target = e.target;
      userStore.setSelectedUsers(target.value, target.checked);
    };
    const handleGropNameChange = (e: any) => {
      const target = e.target;
      setGroupData({ ...groupData, name: target.value });
    };
    const handleSubmitGroupData = async (e: any) => {
      e.preventDefault();
      if (!groupData.name) {
        setErrorMsg("Укажите название!");
      }
      if (groupData.name && userStore.selectedUsers.length > 1) {
        // const usersId = [...userStore.selectedUsers, userStore.user.id];
        const users = userStore.contacts.filter((user: any) => userStore.selectedUsers.includes(user.id));
        const participants = users.map((user: any) => {
          return { userId: user.id, addedOn: Date.now(), isDeleted: false };
        });
        // console.log("userStore.user", userStore.user);
        try {
          const chat = await createChat({
            usersId: [...userStore.selectedUsers, userStore.user.id],
            name: groupData.name,
            admin: [userStore.user.id],
            participants: [...participants, { userId: userStore.user.id, addedOn: Date.now(), isDeleted: false }],
          });

          setTimeout(() => {
            if (chat) {
              socket && socket.emit("create-chat", chat);
              // userStore.setContacts();
              // userStore.setUnreadCount();
            }
            userStore.setContacts();
            setMenuIsOpen(false);
            // userStore.setUnreadCount();
            // userStore.setChatingWith(searchResult[0]);
            // userStore.clearMessages();
            // setSearchResult([]);
            // setValue("");
          }, 0);
        } catch (e: any) {
          console.log(e);
        }
      }
    };
    console.log("error", errorMsg);
    //   e.preventDefault();
    //   if (groupData.name) {
    //     const usersId = [...userStore.selectedUsers, userStore.user.id];
    //     const users = userStore.contacts.filter((user: any) => usersId.includes(user.id));
    //     const participants = users.map((user: any) => {
    //       return { ...user, addedOn: Date.now(), isDeleted: false };
    //     });
    //     // console.log("userStore.user", userStore.user);
    //     try {
    //       const chat = await createChat({
    //         usersId: usersId,
    //         name: groupData.name,
    //         admin: [userStore.user.id],
    //         participants: [...participants, { ...userStore.user, addedOn: Date.now(), isDeleted: false }],
    //       });

    //       setTimeout(() => {
    //         if (chat) {
    //           socket && socket.emit("create-chat", chat);
    //           // userStore.setContacts();
    //           // userStore.setUnreadCount();
    //         }
    //         userStore.setContacts();
    //         setMenuIsOpen(false);
    //         // userStore.setUnreadCount();
    //         // userStore.setChatingWith(searchResult[0]);
    //         // userStore.clearMessages();
    //         // setSearchResult([]);
    //         // setValue("");
    //       }, 0);
    //     } catch (e: any) {
    //       console.log(e);
    //     }
    //   }
    // };
    // console.log(groupData);
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
                  // id={userStore.user.id}
                  avatar={values.avatar}
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
                {/* {userStore.selectedUsers.length < 2 && <p className={styles.warning}>Выберите не менее 2 участников</p>} */}
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
                  {userStore.contacts.map((user: any) => {
                    if (user.id !== userStore.user.id && user.email) {
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
                          <div className={styles.details}>
                            <p> {user.userName}</p>
                            <p> {user.email}</p>
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
