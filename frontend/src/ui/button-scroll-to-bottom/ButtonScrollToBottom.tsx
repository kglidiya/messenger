import styles from "./ButtonScrollToBottom.module.css";

import ArrowDown from "../icons/arrow-down/ArrowDown";

interface IButton {
  onClick?: () => void;
}
export default function ButtonScrollToBottom({ onClick }: IButton) {
  return (
    // <button type='button' aria-label='button' className={styles.button} onClick={onClick}>
    //   <ArrowUp />
    // </button>
    <span onClick={onClick} className={styles.button}>
      <ArrowDown />
    </span>
  );
}
