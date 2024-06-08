/* eslint-disable react-hooks/exhaustive-deps */
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ChangeEvent, MouseEventHandler, useContext, useEffect } from "react";
import { FC, useState, useCallback, useMemo } from "react";

import styles from "./ProfilePhoto.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import EditIcon from "../../ui/icons/edit-icon/EditIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import Loader from "../../ui/loaders/loader/Loader";
import { readFiles } from "../../utils/helpers";

interface IProfilePhoto {
  setValue: any;
  values: any;
  avatar: string | null;
  isProfileEditOpen?: boolean;
  isGroupEditOpen?: boolean;
}

const ProfilePhoto: FC<IProfilePhoto> = observer(({ avatar, setValue, isProfileEditOpen, isGroupEditOpen, values }) => {
  const store = useContext(Context)?.store;
  const socket = useContext(SocketContext);
  const [hover, setHover] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [img, setImg] = useState<string>("");
  const [loaded, setLoaded] = useState(true);
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const handleInputHover: MouseEventHandler<HTMLLabelElement> = (e) => {
    if (e.type === "mouseenter") {
      setHover(true);
    } else setHover(false);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    setLoaded(false);
    let imageFile = files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 350,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setImg(await readFiles(compressedFile));
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  useEffect(() => {
    if (img) {
      setValue({ ...values, avatar: img });
      if (isProfileEditOpen) {
        const data = {
          userId: store?.user?.id,
          avatar: img,
        };
        socket && socket.emit("update-userData", data);
      }
      if (isGroupEditOpen) {
        const data = {
          roomId: store?.currentRoom?.id,
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
