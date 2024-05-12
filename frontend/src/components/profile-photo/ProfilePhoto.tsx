import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect } from "react";
import { FC, useState, useCallback, useMemo } from "react";

import styles from "./ProfilePhoto.module.scss";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";

// import { Camera } from "../../icons/Camera/Camera";
// import { TForm } from "../../utils/types";

interface IProfilePhoto {
  // id: string | string[];
  setValue: any;
  values: any;
  avatar: any;
  isProfileEditOpen?: boolean;
  isGroupEditOpen?: boolean;
}

const ProfilePhoto: FC<IProfilePhoto> = observer(({ avatar, setValue, isProfileEditOpen, isGroupEditOpen, values }) => {
  const userStore = useContext(Context).user;
  const socket = useContext(SocketContext);
  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [img, setImg] = useState<any>("");
  const [sizeLimit, setSizelimit] = useState(false);

  const handleInputHover: MouseEventHandler<HTMLLabelElement> = (e) => {
    if (e.type === "mouseenter") {
      setHover(true);
    } else setHover(false);
  };
  const readFiles = (file: any) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target?.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };
  // console.log(isProfileEditOpen);
  // console.log(isGroupEditOpen);
  const handleImageChange = async (e: any) => {
    // console.log("handleImageChange");
    let imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 450,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      // console.log(await readFiles(compressedFile));
      // setValue({ ...values, avatar: await readFiles(compressedFile) });
      setImg(await readFiles(compressedFile));
      // const data = {
      //   roomId: userStore.currentRoom.id,
      //   avatar: await readFiles(compressedFile),
      // };
      // console.log("edit-group avatarr");
      // socket && socket.emit("edit-group", data);
    } catch (error) {
      console.log(error);
    }

    // const form = new FormData();
    // form.append("file", file);
    // userStore.updateAvatar(form);

    // // setImg(file);
    // console.log(form.get(file));
    // if (e.target.files[0]) {

    // const data = {
    //   userId: userStore.user.id,
    //   // userName: values.userName,
    //   // avatar: "",
    // };
    // // socket && socket.emit("update-userData", data);
    setTimeout(() => {
      // console.log(values);
      // const data = {
      //   userId: userStore.user.id,
      //   avatar: values.avatar,
      // };
      // socket && socket.emit("update-userData", data);
    }, 0);
  };
  // console.log(values);
  useEffect(() => {
    if (img) {
      setValue({ ...values, avatar: img });
      if (isProfileEditOpen) {
        const data = {
          userId: userStore.user.id,
          avatar: img,
        };
        socket && socket.emit("update-userData", data);
      }
      if (isGroupEditOpen) {
        const data = {
          roomId: userStore.currentRoom.id,
          avatar: img,
        };
        console.log("edit-group avatarr");
        socket && socket.emit("edit-group", data);
      }
    }
    // setValue({ ...values, avatar: img });

    // console.log(img);
  }, [img]);

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
  // console.log(avatar);
  return (
    <motion.div
      className={styles.avatar}
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: isProfileEditOpen || isGroupEditOpen ? "auto" : 0,
        opacity: isProfileEditOpen || isGroupEditOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* {sizeLimit && <p className={styles.avatar__requirements_size}>(Размер файла должен быть менее 2 мб)</p>} */}
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
});

export default ProfilePhoto;
