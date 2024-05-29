import { motion, useInView } from "framer-motion";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import styles from "./SideBar.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useDebounce from "../../hooks/useDebounce";
import useMediaQuery from "../../hooks/useMediaQuery";
import Logo from "../../ui/icons/Logo/Logo";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";
import Loader from "../../ui/loader/Loader";
import MenuButton from "../../ui/menu-button/MenuButton";
import { createChat, findUser } from "../../utils/api";
import Contact from "../contact/Contact";
import UserProfile from "../user-profile/UserProfile";

const streamToBlob = require("stream-to-blob");

interface ISideBar {
  isLoadingContacts: boolean;
  isLoadingMessages: boolean;
  isContactsVisible: boolean;
  setIsContactsVisible: any;
}

const SideBar = observer(
  ({ isLoadingContacts, isLoadingMessages, setIsContactsVisible, isContactsVisible }: ISideBar) => {
    const store = useContext(Context).user;
    const socket = useContext(SocketContext);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<any>([]);
    const [value, setValue] = useState("");
    const matchesTablet = useMediaQuery("(min-width: 992px)");
    const matchesMobile = useMediaQuery("(max-width: 576px)");
    useEffect(() => {
      if (store.contacts.length > 0) {
        // console.log("unreadCount", toJS(store.unreadCount));
        store.setUnreadCount();
      }
    }, [store.contacts.length]);
    // console.log(toJS(store.unreadCount));

    const [isMenuOpen, setMenuIsOpen] = useState(false);

    const toggle = () => {
      setMenuIsOpen(!isMenuOpen);
    };

    const searchUser = async (email: string) => {
      const result = await findUser(email);

      // const result = await findUser(email);
      //console.log(result);
      if (result.length) {
        setSearchResult(result);
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
      if (target.value !== store.user.email) {
        setValue(target.value);
        const email = target.value.toLowerCase();
        debouncedSearch({ email: email });
      }
    };
    // console.log(searchResult);
    const createChart = async () => {
      // createChat({ usersId: [searchResult[0].id, store.user.id], groupId: store.roomId });
      try {
        const chat = await createChat({ usersId: [searchResult[0].id, store.user.id] });

        setTimeout(() => {
          if (chat) {
            socket && socket.emit("create-chat", chat);
            // store.setContacts();
            // store.setUnreadCount();
          }
          // store.setContacts();
          // store.setUnreadCount();
          // store.setChatingWith(searchResult[0]);
          // store.clearMessages();
          setSearchResult([]);
          setValue("");
        }, 0);
      } catch (e: any) {
        console.log(e);
      }
    };

    useEffect(() => {
      store.setContactToForward(null);
    }, []);
    // console.log(isMenuOpen);
    // console.log(toJS(store.contacts));
    const resetSearchResult = () => {
      store.setChatingWith(store.contacts[0]);
      store.clearMessages();
      setSearchResult([]);
      setValue("");
    };
    const onSubmit = (e: any) => {
      e.preventDefault();
    };
    // const matchesMobile = useMediaQuery("(max-width: 576px)");
    // console.log("matchesMobile", matchesMobile);
    return (
      <div
        className={styles.wrapper}
        style={{
          width: matchesMobile ? (isContactsVisible ? "100%" : 0) : "",
          visibility: matchesMobile ? (isContactsVisible ? "visible" : "hidden") : "visible",
        }}
      >
        <UserProfile isMenuOpen={isMenuOpen} setMenuIsOpen={setMenuIsOpen} />
        <div className={styles.menu}>
          {store.user.avatar ? (
            <img
              // src={`http://localhost:3001/avatar/${store.user.avatar.id}`}
              src={store.user.avatar}
              alt='Мой аватар'
              className={styles.avatar}
            />
          ) : (
            <NoAvatar width={44} height={44} />
          )}
          <MenuButton onClick={toggle} open={isMenuOpen} />
        </div>
        <div className={styles.content}>
          {isLoadingContacts && !store.contacts.length && isLoadingMessages && (
            <div style={{ marginTop: "30vh" }}>
              <Loader color='white' />
            </div>
          )}
          {searchResult.length === 0 &&
            store.unreadCount.length === store.contacts.length &&
            store.contacts.map((user: any, i: number) => (
              <Contact
                key={user.chatId}
                user={user}
                unread={store.unreadCount[i].unread}
                setIsContactsVisible={setIsContactsVisible}
              />
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
                      <Contact user={el} unread={0} setIsContactsVisible={setIsContactsVisible} />
                      {store.contacts.findIndex((user: any) => user.id === searchResult[0].id) === -1 && (
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
        <form className={styles.searchContainer} onSubmit={onSubmit}>
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
        <Logo width={matchesTablet ? 100 : 60} height={matchesTablet ? 100 : 60} bottom={5} left={5} color='#23425a' />
        <span className={styles.searchIcon}>
          <SearchIcon color='#ddd6c7' />
        </span>
      </div>
    );
  },
);

export default SideBar;
