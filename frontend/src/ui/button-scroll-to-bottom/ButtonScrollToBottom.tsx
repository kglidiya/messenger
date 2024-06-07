import styles from "./ButtonScrollToBottom.module.css";

import ArrowDown from "../icons/arrow-down/ArrowDown";

interface IButton {
  onClick?: () => void;
}
export default function ButtonScrollToBottom({ onClick }: IButton) {
  return (
    <span onClick={onClick} className={styles.button}>
      <ArrowDown />
    </span>
  );
}
