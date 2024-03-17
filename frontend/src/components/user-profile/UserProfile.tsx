import { motion } from "framer-motion";
import React, { useContext, useState } from "react";

import styles from "./UserProfile.module.css";

import { Context } from "../..";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import ExitIcon from "../../ui/icons/exit-icon/ExitIcon";
import PlaneIcon from "../../ui/icons/plane/PlaneIcon";
import ProfilePhoto from "../profile-photo/ProfilePhoto";

export default function UserProfile({
  isMenuOpen,
}: //   avatar,
//   username,
{
  isMenuOpen: boolean;
  //   avatar: string;
  //   username: string;
}) {
  const userStore = useContext(Context).user;
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [values, setValues] = useState({ avatar: userStore.user.avatar, username: userStore.user.username });
  const toggle = () => {
    setIsProfileEditOpen(!isProfileEditOpen);
  };
  console.log(userStore.user);
  const handleChange = (e: any) => {
    const target = e.target;
    setValues({ ...values, username: target.value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(values);
  };
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isMenuOpen ? 1 : 0, opacity: isMenuOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <ul className={styles.list}>
        <li onClick={() => userStore.setAuth(false)} className={styles.list__item}>
          Выйти <ExitIcon />
        </li>
        <li className={styles.list__item} onClick={toggle}>
          Редактировать профиль <EditIcon color='#ddd6c7' />
        </li>
        <motion.li
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isProfileEditOpen ? "auto" : 0, opacity: isProfileEditOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={styles.list__item}
        >
          <form onSubmit={handleSubmit} className={styles.form}>
            <ProfilePhoto
              avatar={values.avatar}
              setValue={setValues}
              isProfileEditOpen={isProfileEditOpen}
              values={values}
            />
            <motion.div
              className={styles.inputContainer}
              // animate={{ height: isProfileEditOpen ? "auto" : 0, opacity: isProfileEditOpen ? 1 : 0 }}
              // transition={{ duration: 0.3 }}
            >
              <input
                className={styles.input}
                type='text'
                placeholder='Ваше имя'
                value={values.username}
                onChange={handleChange}
              />

              <button className={styles.buttonSend}>
                <PlaneIcon />
              </button>
            </motion.div>
          </form>
        </motion.li>
      </ul>
    </motion.div>
  );
}
