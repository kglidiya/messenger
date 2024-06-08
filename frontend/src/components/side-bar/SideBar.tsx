/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import styles from "./SideBar.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useDebounce from "../../hooks/useDebounce";
import useMediaQuery from "../../hooks/useMediaQuery";
import AppStore from "../../store/AppStore";
import Logo from "../../ui/icons/Logo/Logo";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";
import Loader from "../../ui/loaders/loader/Loader";
import MenuButton from "../../ui/menu-button/MenuButton";
import { createChat, findUser } from "../../utils/api";
import { IUser } from "../../utils/types";
import Contact from "../contact/Contact";
import UserProfile from "../user-profile/UserProfile";

interface ISideBar {
  isLoadingContacts: boolean;
  isLoadingMessages: boolean;
  isContactsVisible: boolean;
  setIsContactsVisible: Dispatch<SetStateAction<boolean>>;
}

const SideBar = observer(({ isLoadingContacts, setIsContactsVisible, isContactsVisible }: ISideBar) => {
  const store = useContext(Context)?.store as AppStore;
  const socket = useContext(SocketContext);
  const [searchResult, setSearchResult] = useState<IUser[] | string[]>([]);
  const [value, setValue] = useState("");
  const matchesTablet = useMediaQuery("(min-width: 992px)");
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  useEffect(() => {
    if (store.contacts.length > 0) {
      store.setUnreadCount();
    }
  }, [store.contacts.length]);

  const [isMenuOpen, setMenuIsOpen] = useState(false);

  const toggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };

  const searchUser = async (email: string) => {
    const result = await findUser(email);

    if (result) {
      setSearchResult([result]);
    } else {
      setSearchResult(["Пользователь не найден"]);
      setTimeout(() => {
        setSearchResult([]);
      }, 2000);
    }
  };

  const debouncedSearch = useDebounce(searchUser, 1500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.value !== store.user?.email) {
      setValue(target.value);
      const email = target.value.toLowerCase();
      debouncedSearch({ email: email });
    }
  };

  const createChart = async () => {
    try {
      const chat = await createChat({ usersId: [(searchResult[0] as IUser).id, store.user?.id as string] });

      setTimeout(() => {
        if (chat) {
          socket && socket.emit("create-chat", chat);
        }
        setSearchResult([]);
        setValue("");
      }, 0);
    } catch (err) {
      console.error("Произошла ошибка:", err);
    }
  };

  useEffect(() => {
    store.setContactToForward(null);
  }, []);
  const resetSearchResult = () => {
    store.setChatingWith(store.contacts[0]);
    store.clearMessages();
    setSearchResult([]);
    setValue("");
  };

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
        {store.user?.avatar ? (
          <img src={store.user?.avatar} alt='Мой аватар' className={styles.avatar} />
        ) : (
          <NoAvatar width={44} height={44} />
        )}
        <MenuButton onClick={toggle} open={isMenuOpen} />
      </div>
      <div className={styles.content}>
        {isLoadingContacts && (
          <div style={{ marginTop: "30vh" }}>
            <Loader color='white' />
          </div>
        )}
        {searchResult.length === 0 &&
          store.unreadCount.length === store.contacts.length &&
          store.contacts.map((user, i) => (
            <Contact
              key={user.chatId}
              user={user}
              unread={store.unreadCount[i].unread}
              setIsContactsVisible={setIsContactsVisible}
            />
          ))}
        {searchResult.length > 0 && (
          <>
            {searchResult.map((el) => {
              if (typeof el === "string") {
                return (
                  <motion.div
                    key={el}
                    className={styles.searchResult}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    style={{
                      height: matchesMobile ? "90%" : "100%",
                      justifyContent: matchesMobile ? "flex-end" : "center",
                    }}
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
                    style={{
                      height: matchesMobile ? "90%" : "auto",
                      justifyContent: matchesMobile ? "flex-end" : "",
                    }}
                  >
                    <Contact user={{ ...el, chatId: "" }} unread={0} setIsContactsVisible={setIsContactsVisible} />
                    {store.contacts.findIndex((user) => user.id === (searchResult[0] as IUser).id) === -1 && (
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
      <div className={styles.searchContainer}>
        <input
          autoComplete='off'
          type='text'
          className={styles.searchInput}
          placeholder='Email пользователя'
          name='email'
          onChange={handleChange}
          value={value}
        />
      </div>
      <Logo width={matchesTablet ? 100 : 70} height={matchesTablet ? 100 : 70} bottom={15} left={3} color='#23425a' />
      <span className={styles.searchIcon}>
        <SearchIcon color='#ddd6c7' />
      </span>
    </div>
  );
});

export default SideBar;
