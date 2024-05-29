import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect } from "react";
import { FC, useState, useCallback, useMemo } from "react";

import styles from "./ProfilePhoto.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import Loader from "../../ui/loader/Loader";

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
  const store = useContext(Context).user;
  const socket = useContext(SocketContext);
  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [img, setImg] = useState<any>("");
  const [loaded, setLoaded] = useState(true);
  const matchesMobile = useMediaQuery("(max-width: 576px)");
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
    setLoaded(false);
    let imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 450,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setImg(await readFiles(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(values);
  useEffect(() => {
    if (img) {
      setValue({ ...values, avatar: img });
      if (isProfileEditOpen) {
        const data = {
          userId: store.user.id,
          avatar: img,
        };
        socket && socket.emit("update-userData", data);
      }
      if (isGroupEditOpen) {
        const data = {
          roomId: store.currentRoom.id,
          avatar: img,
        };
        socket && socket.emit("edit-group", data);
      }
    }
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
  // console.log("loaded", loaded);
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
          {!loaded && (
            <div className={styles.loader}>
              <Loader color='white' />
            </div>
          )}
          {avatar ? (
            <img src={avatar} alt={"Аватар"} className={styles.image} onLoad={() => setLoaded(true)}></img>
          ) : (
            <NoAvatar width={180} height={180} />
          )}
          <span
            className={`${styles.button} 
            ${isVisible || matchesMobile ? styles.button_default : styles.button_active}`}
          >
            <EditIcon color='white' />
          </span>
        </label>
      </div>
    </motion.div>
  );
});

export default ProfilePhoto;
