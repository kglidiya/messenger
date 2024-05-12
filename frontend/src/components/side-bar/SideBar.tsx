import { motion, useInView } from "framer-motion";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import styles from "./SideBar.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useDebounce from "../../hooks/useDebounce";
import Logo from "../../ui/icons/Logo/Logo";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";
import MenuButton from "../../ui/menu-button/MenuButton";
import { createChat, findUser } from "../../utils/api";
import { users } from "../../utils/mockData";
import Contact from "../contact/Contact";
import UserProfile from "../user-profile/UserProfile";

const streamToBlob = require("stream-to-blob");

const SideBar = observer(() => {
  const userStore = useContext(Context).user;
  const socket = useContext(SocketContext);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (userStore.contacts.length > 0) {
      // console.log("unreadCount", toJS(userStore.unreadCount));
      userStore.setUnreadCount();
    }
  }, [userStore.contacts.length]);
  // console.log(toJS(userStore.unreadCount));

  const [isMenuOpen, setMenuIsOpen] = useState(false);

  const toggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };

  const searchUser = async (email: string) => {
    // setIsSearching(true);

    const result = await findUser(email);

    // const result = await findUser(email);
    //console.log(result);
    if (result.length) {
      setSearchResult(result);
      //setIsSearching(false);
    } else {
      setSearchResult(["Пользователь не найден"]);
      setTimeout(() => {
        setSearchResult([]);
        // setValue("");
      }, 2000);
    }

    // setIsSearching(false);
  };

  const debouncedSearch = useDebounce(searchUser, 1500);

  const handleChange = (e: any) => {
    const target = e.target;
    if (target.value !== userStore.user.email) {
      setValue(target.value);
      debouncedSearch({ email: target.value });
    }
  };
  // console.log(searchResult);
  const createChart = async () => {
    // createChat({ usersId: [searchResult[0].id, userStore.user.id], groupId: userStore.roomId });
    try {
      const chat = await createChat({ usersId: [searchResult[0].id, userStore.user.id] });

      setTimeout(() => {
        if (chat) {
          socket && socket.emit("create-chat", chat);
          // userStore.setContacts();
          // userStore.setUnreadCount();
        }
        // userStore.setContacts();
        // userStore.setUnreadCount();
        // userStore.setChatingWith(searchResult[0]);
        // userStore.clearMessages();
        setSearchResult([]);
        setValue("");
      }, 0);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    userStore.setContactToForward(null);
  }, []);
  // console.log(isMenuOpen);
  // console.log(toJS(userStore.contacts));
  const resetSearchResult = () => {
    userStore.setChatingWith(userStore.contacts[0]);
    userStore.clearMessages();
    setSearchResult([]);
    setValue("");
  };
  return (
    <div className={styles.wrapper}>
      <UserProfile isMenuOpen={isMenuOpen} setMenuIsOpen={setMenuIsOpen} />
      <div className={styles.menu}>
        {userStore.user.avatar ? (
          <img
            // src={`http://localhost:3001/avatar/${userStore.user.avatar.id}`}
            src={userStore.user.avatar}
            alt='Мой аватар'
            className={styles.avatar}
          />
        ) : (
          <NoAvatar width={44} height={44} />
        )}
        <MenuButton onClick={toggle} open={isMenuOpen} />
      </div>
      <div className={styles.content}>
        {searchResult.length === 0 &&
          userStore.unreadCount.length === userStore.contacts.length &&
          userStore.contacts.map((user: any, i: number) => (
            <Contact key={user.id} user={user} unread={userStore.unreadCount[i].unread} />
          ))}
        {searchResult.length > 0 && (
          <>
            {searchResult.map((el: any) => {
              if (typeof el === "string") {
                return (
                  <motion.div
                    key={el}
                    className={styles.searchResult}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                  >
                    <p className={styles.notification}>{el}</p>
                    <ShrugIcon color={"white"} />
                  </motion.div>
                );
              } else
                return (
                  <motion.div
                    key={el.id}
                    className={styles.searchResult}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                  >
                    <Contact user={el} unread={0} />
                    {userStore.contacts.findIndex((user: any) => user.id === searchResult[0].id) === -1 && (
                      <button onClick={createChart} className={styles.addContactBtn}>
                        Добавить в контакты
                      </button>
                    )}
                    <button onClick={resetSearchResult} className={styles.addContactBtn}>
                      Показать все контакты
                    </button>
                  </motion.div>
                );
            })}
          </>
        )}
      </div>
      <form className={styles.searchContainer}>
        <input
          autoComplete='off'
          type='text'
          className={styles.searchInput}
          placeholder='Email пользователя'
          name='email'
          onChange={handleChange}
          value={value}
        />
      </form>
      <Logo bottom={5} left={5} color='#23425a' />
      <span className={styles.searchIcon}>
        <SearchIcon color='#ddd6c7' />
      </span>
    </div>
  );
});

export default SideBar;
