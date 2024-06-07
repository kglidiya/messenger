import { motion } from "framer-motion";

import styles from "./ContactDetails.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";

interface IContactDetailsProps {
  avatar: string | null;
  email?: string;
  userName: string;
  onClick: VoidFunction;
  isPopupDetailsOpen: boolean;
}
export default function ContactDetails({ avatar, email, userName, onClick, isPopupDetailsOpen }: IContactDetailsProps) {
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  return (
    <motion.aside
      className={styles.wrapper}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPopupDetailsOpen ? 1 : 0, opacity: isPopupDetailsOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.avatar}>
        {avatar ? (
          <img src={avatar} alt='Аватар' className={styles.avatar} />
        ) : (
          <NoAvatar width={200} height={matchesMobile ? 220 : 300} />
        )}
      </div>
      <div className={styles.userDetails}>
        <div>
          <p className={styles.userName}>{userName}</p>
          <p className={styles.email}>{email}</p>
        </div>
        <button className={styles.shareContactBtn} onClick={onClick}>
          Поделиться контактом
          <ShareIcon bottom={4} right={5} width={35} height={35} />
        </button>
      </div>
    </motion.aside>
  );
}
