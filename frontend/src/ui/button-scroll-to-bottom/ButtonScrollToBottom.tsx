import styles from "./ButtonScrollToBottom.module.css";

import ArrowUp from "../icons/arrow-up/ArrowUp";

interface IButton {
  onClick?: () => void;
}
export default function ButtonScrollToBottom({ onClick }: IButton) {
  return (
    <button type='button' aria-label='button' className={styles.button} onClick={onClick}>
      <ArrowUp />
    </button>
  );
}
