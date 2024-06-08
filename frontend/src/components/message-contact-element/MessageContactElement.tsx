import { observer } from "mobx-react-lite";

import styles from "./MessageContactElement.module.css";

import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";

interface IMessageContactElementProps {
  avatar: string | null;
  email?: string;
  userName: string;
  openMessageActionsPopup?: VoidFunction;
}

const MessageContactElement = observer(
  ({ avatar, email, userName, openMessageActionsPopup }: IMessageContactElementProps) => {
    return (
      <div className={styles.wrapper} onClick={openMessageActionsPopup}>
        {avatar ? <img src={avatar} alt='Аватар' className={styles.avatar} /> : <NoAvatar width={44} height={44} />}
        <div>
          <p className={styles.text}>{email}</p>
          <p className={styles.text}>{userName}</p>
        </div>
      </div>
    );
  },
);

export default MessageContactElement;
