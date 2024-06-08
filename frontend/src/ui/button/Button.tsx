import styles from "./Button.module.css";

interface IButton {
  text: string;
  width: string;
  fontSize: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}
export default function Button({ text, width, fontSize, onClick, disabled, type = "button" }: IButton) {
  return (
    <button type={type} className={styles.button} style={{ width, fontSize }} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
