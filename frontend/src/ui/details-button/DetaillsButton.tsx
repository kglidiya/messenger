import styles from "./DetailsButton.module.css";

export default function DetailsButton({ onClick }: { onClick: VoidFunction }) {
  return (
    <span className={styles.button} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </span>
  );
}
