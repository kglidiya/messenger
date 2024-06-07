import styles from "./MenuButton.module.css";

export default function MenuButton({ onClick, open }: { onClick: VoidFunction; open: boolean }) {
  return (
    <div className={open ? `${styles.button} ${styles.open}` : `${styles.button} `} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
