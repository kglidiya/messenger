import React, { useState } from "react";

import styles from "./SideBar.module.css";

import Logo from "../../ui/icons/Logo/Logo";
import MenuButton from "../../ui/menu-button/MenuButton";
import { contacts } from "../../utils/mockData";
import Contact from "../contact/Contact";

export default function SideBar() {
  const [isMenuOpen, setMenuIsOpen] = useState(false);
  const toggle = () => {
    setMenuIsOpen(!isMenuOpen);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <img
          src={
            "https://mykaleidoscope.ru/x/uploads/posts/2022-10/1666314912_24-mykaleidoscope-ru-p-nedovolnaya-morda-vkontakte-25.jpg"
          }
          alt='Мой аватар'
          className={styles.avatar}
        />
        <MenuButton onClick={toggle} open={isMenuOpen} />
      </div>

      {contacts.map((contact) => (
        <Contact key={contact.id} {...contact} />
      ))}
      <Logo />
    </div>
  );
}
