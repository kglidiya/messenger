import { motion } from "framer-motion";
import React, { Dispatch, MouseEventHandler, SetStateAction, useContext } from "react";
import { FC, useState, useCallback, useMemo } from "react";

import styles from "./ProfilePhoto.module.scss";

import { Context } from "../..";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";

// import { Camera } from "../../icons/Camera/Camera";
// import { TForm } from "../../utils/types";

interface IProfilePhoto {
  setValue: any;
  values: any;
  avatar: string;
  isProfileEditOpen?: boolean;
}
const ProfilePhoto: FC<IProfilePhoto> = ({ avatar, setValue, isProfileEditOpen, values }) => {
  const userStore = useContext(Context).user;
  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [img, setImg] = useState<string>();
  const [sizeLimit, setSizelimit] = useState(false);

  const handleInputHover: MouseEventHandler<HTMLLabelElement> = (e) => {
    if (e.type === "mouseenter") {
      setHover(true);
    } else setHover(false);
  };
  const handleImageChange = (e: any) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
    if (file.size > 2097152) {
      setSizelimit(true);
    } else setSizelimit(false);
    setValue({ ...values, [e.target.name]: URL.createObjectURL(file) });
    userStore.setUser({ ...userStore.user, avatar: URL.createObjectURL(file) });
    // setValue({ ...form, profile: { ...form.profile, [e.target.name]: "https://loremflickr.com/320/240/cats" } }); //версия с заглушкой
  };

  const handleButtonVisibility = useCallback(() => {
    if (avatar && hover) {
      setIsVisible(true);
    }
    if (avatar && !hover) {
      setIsVisible(false);
    } else setIsVisible(true);
  }, [hover, img]);

  useMemo(() => {
    handleButtonVisibility();
  }, [handleButtonVisibility]);

  return (
    <motion.div
      className={styles.avatar}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isProfileEditOpen ? "auto" : 0, opacity: isProfileEditOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {sizeLimit && <p className={styles.avatar__requirements_size}>(Размер файла должен быть менее 2 мб)</p>}
      <input
        type='file'
        name='avatar'
        id='avatar'
        accept='image/jpeg,image/png'
        className={`${styles.input_hidden}`}
        onChange={handleImageChange}
      />
      <div className={styles.wrapper}>
        <label
          className={styles.label}
          htmlFor='avatar'
          onMouseEnter={handleInputHover}
          onMouseLeave={handleInputHover}
        >
          {avatar ? (
            <img src={avatar} alt={"Аватар"} className={styles.label__image}></img>
          ) : (
            <NoAvatar width={180} height={180} />
          )}
          <span
            className={`${styles.label__button} 
            ${isVisible ? styles.label__button_status_default : styles.label__button_status_active}`}
          >
            <EditIcon color='white' />
          </span>
        </label>
      </div>
    </motion.div>
  );
};

export default ProfilePhoto;
