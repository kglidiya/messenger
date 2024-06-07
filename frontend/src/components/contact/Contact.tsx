import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useContext } from "react";

import styles from "./Contact.module.css";

import { Context } from "../..";
import useMediaQuery from "../../hooks/useMediaQuery";
import AppStore from "../../store/AppStore";
import Avatar from "../../ui/avatar/Avatar";
import Counter from "../../ui/counter/Counter";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import { IContact } from "../../utils/types";

interface IContactProps {
  user: IContact;
  unread: number;
  setIsContactsVisible?: Dispatch<SetStateAction<boolean>>;
}

const Contact = observer(({ user, unread, setIsContactsVisible }: IContactProps) => {
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const store = useContext(Context)?.store as AppStore;
  const handleContactClick = () => {
    if (store.chatingWith?.chatId !== user.chatId) {
      store.clearMessages();
      store.setChatingWith(user);
    }
    if (matchesMobile) {
      setIsContactsVisible?.(false);
    }
  };

  return (
    <>
      {user && (
        <article className={styles.wrapper} onClick={handleContactClick}>
          {user.avatar ? <Avatar avatar={user.avatar} width={50} height={50} /> : <NoAvatar width={44} height={44} />}
          <div className={styles.details}>
            <div className={styles.userInfo}>
              <p className={styles.name}>{user.userName ? user.userName : user.email}</p>
              {user.email && user.isOnline && <p className={styles.onlineStatus}>В сети</p>}
              {user.email && !user.isOnline && <p className={styles.onlineStatus}>Не в сети</p>}
            </div>
            {unread > 0 && <Counter messages={unread} />}
          </div>
        </article>
      )}
    </>
  );
});

export default Contact;
