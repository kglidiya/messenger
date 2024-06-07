import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

import styles from "./OverLay.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";

interface IOverLayProps {
  children: ReactNode;
  closePopup: VoidFunction;
}

export default function OverLay({ children, closePopup }: IOverLayProps) {
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  return (
    <AnimatePresence>
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CloseIcon
          onClick={closePopup}
          width={matchesMobile ? 40 : 53}
          height={matchesMobile ? 40 : 53}
          top={30}
          right={30}
          color='white'
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
