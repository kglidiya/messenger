import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import styles from "./SideBar.module.css";

import { Context } from "../..";
import Logo from "../../ui/icons/Logo/Logo";
import MenuButton from "../../ui/menu-button/MenuButton";
import { users } from "../../utils/mockData";
import Contact from "../contact/Contact";

const SideBar = observer(() => {
  const userStore = useContext(Context).user;
  useEffect(() => {
    userStore.setContacts();
  }, [userStore]);
  const [isMenuOpen, setMenuIsOpen] = useState(false);
  const toggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <img src={userStore.user.avatar} alt='Мой аватар' className={styles.avatar} />
        <MenuButton onClick={toggle} open={isMenuOpen} />
      </div>

      {userStore.contacts.map((user: any) => (
        <Contact key={user.id} {...user} />
      ))}
      <Logo />
    </div>
  );
});

export default SideBar;
