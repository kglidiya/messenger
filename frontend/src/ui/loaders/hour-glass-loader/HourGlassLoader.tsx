import styles from "./HourGlassLoader.module.css";

export default function HourGlassLoader() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.loader}></span>
    </div>
  );
}
