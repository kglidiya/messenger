import { motion } from "framer-motion";

import styles from "./TypingIndicator.module.css";

import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import LoaderDots from "../../ui/loader-dots/LoaderDots";

interface ITypingIndicator {
  userName: string;
  email: string;
  avatar: string;
}

export default function TypingIndicator({ userName, email, avatar }: ITypingIndicator) {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className={styles.rows}>
        {avatar ? <img src={avatar} alt='аватар' className={styles.avatar} /> : <NoAvatar width={25} height={25} />}
        <div>
          {userName ? <p className={styles.text}>{userName}</p> : <p className={styles.text}>{email}</p>}
          <div className={styles.rows}>
            <p className={styles.text}>Печатает</p>
            <LoaderDots />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
