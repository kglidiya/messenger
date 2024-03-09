import { ReactNode } from "react";

import styles from "./OverLay.module.css";

import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";

interface IOverLayProps {
  children: ReactNode;
  closePopup: VoidFunction;
}

export default function OverLay({ children, closePopup }: IOverLayProps) {
  return (
    <div
      className={`${styles.overlay} `}
      // onClick={(e) => {
      //   if (e.target === e.currentTarget) {
      //     closePopup();
      //   }
      // }}
    >
      <span className={styles.closeButton}>
        <CloseIcon onClick={closePopup} />
      </span>
      {children}
    </div>
  );
}
