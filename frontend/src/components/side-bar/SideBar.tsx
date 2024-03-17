import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import styles from "./SideBar.module.css";

import { Context } from "../..";
import Logo from "../../ui/icons/Logo/Logo";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import MenuButton from "../../ui/menu-button/MenuButton";
import { users } from "../../utils/mockData";
import Contact from "../contact/Contact";
import UserProfile from "../user-profile/UserProfile";

const SideBar = observer(() => {
  const userStore = useContext(Context).user;
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  useEffect(() => {
    userStore.setContacts();
  }, [userStore]);
  const [isMenuOpen, setMenuIsOpen] = useState(false);
  const toggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };

  return (
    <div className={styles.wrapper}>
      <UserProfile isMenuOpen={isMenuOpen} />
      <div className={styles.menu}>
        <img src={userStore.user.avatar} alt='Мой аватар' className={styles.avatar} />
        <MenuButton onClick={toggle} open={isMenuOpen} />
      </div>
      <div className={styles.content}>
        {userStore.contacts.map((user: any) => (
          <Contact key={user.id} {...user} />
        ))}
      </div>
      <div className={styles.searchContainer}>
        <input type='text' className={styles.searchInput} placeholder='Email пользователя' />
      </div>
      <Logo bottom={5} left={5} color='#23425a' />
      <span className={styles.searchIcon}>
        <SearchIcon />
      </span>
    </div>
  );
});

export default SideBar;
