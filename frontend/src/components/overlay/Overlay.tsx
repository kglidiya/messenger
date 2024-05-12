import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

import styles from "./OverLay.module.css";

import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";

interface IOverLayProps {
  children: ReactNode;
  closePopup: VoidFunction;
}

export default function OverLay({ children, closePopup }: IOverLayProps) {
  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.overlay} `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        // transition={{ duration: 1, ease: "easeInOut" }}
        // onClick={(e) => {
        //   if (e.target === e.currentTarget) {
        //     closePopup();
        //   }
        // }}
      >
        <span className={styles.closeButton}>
          <CloseIcon onClick={closePopup} width={53} height={53} top={30} right={30} />
        </span>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
