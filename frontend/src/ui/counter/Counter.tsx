import styles from "./Counter.module.css";

export default function Counter({ messages }: { messages: number }) {
  return <span className={styles.wrapper}>{messages}</span>;
}
