import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";

import styles from "./GroupContact.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import Avatar from "../../ui/avatar/Avatar";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";
import HourGlassLoader from "../../ui/loaders/hour-glass-loader/HourGlassLoader";

import LoaderButton from "../../ui/loaders/loader-button/LoaderButton";
import { IRoomParticipant } from "../../utils/types";

interface IContactProps {
  user: IRoomParticipant;
}

const GroupContact = observer(({ user }: IContactProps) => {
  const socket = useContext(SocketContext);
  const store = useContext(Context)?.store;
  const isAdmin = store?.currentRoom?.admin.includes(store?.user?.id as string);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingToAdmin, setIsAddingToAdmin] = useState(false);
  const deleteUser = (userId: string) => {
    setIsDeleting(true);
    const participantsId = store?.currentRoom?.usersId
      .split(",")
      .filter((id: string) => id !== userId)
      .join();

    const participants = store?.currentRoom?.participants.map((user) => {
      if (user.userId === userId) {
        return { addedOn: user.addedOn, userId: user.userId, isDeleted: true };
      } else return { addedOn: user.addedOn, userId: user.userId, isDeleted: user.isDeleted };
    });
    const data = {
      roomId: store?.currentRoom?.id,
      usersId: participantsId,
      participants,
    };
    socket && socket.emit("edit-group", data);
  };

  const addAdmin = (userId: string) => {
    setIsAddingToAdmin(true);
    const andmins = [...(store?.currentRoom?.admin as string[]), userId];
    const data = {
      roomId: store?.currentRoom?.id,
      admin: andmins,
    };

    socket && socket.emit("edit-group", data);
  };
  useEffect(() => {
    if (isAdmin) {
      setIsAddingToAdmin(false);
    }
  }, [isAdmin]);
  return (
    <>
      {user && (
        <article className={styles.wrapper}>
          {user.avatar ? <Avatar avatar={user.avatar} width={44} height={44} /> : <NoAvatar width={40} height={40} />}
          <div className={styles.details}>
            <div className={styles.nameContainer}>
              {user.email && <p className={styles.name}>{user.email}</p>}
              {user.userName && <p className={styles.name}>{user.userName}</p>}
            </div>
            {store?.currentRoom?.admin.includes(user.userId) && <p className={styles.role}>Admin</p>}
          </div>
          {isAdmin && !store?.currentRoom?.admin.includes(user.userId) && (
            <button onClick={() => addAdmin(user.userId)} className={styles.addToAdminButton} disabled={isDeleting}>
              {isAddingToAdmin ? <LoaderButton /> : `Добавить в admin`}
            </button>
          )}

          {isAdmin &&
            !isDeleting &&
            !store?.currentRoom?.admin.includes(user.userId) &&
            (store?.currentRoom?.usersId as string).split(",").length >= 4 && (
              <TrashIcon
                width={28}
                height={28}
                onClick={() => {
                  if (!isAddingToAdmin) {
                    deleteUser(user.userId);
                  }
                }}
                top={13}
                right={100}
              />
            )}
          {isDeleting && (
            <span className={styles.deleteLoader}>
              <HourGlassLoader />
            </span>
          )}
        </article>
      )}
    </>
  );
});

export default GroupContact;
