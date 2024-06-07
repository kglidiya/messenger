import styles from "./ButtonSend.module.css";

import PlaneIcon from "../icons/plane/PlaneIcon";

export default function ButtonSend({
  onClick,
  right,
  bottom,
  top,
}: {
  onClick?: VoidFunction;
  right: number;
  bottom?: number;
  top?: number;
}) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={{
        bottom: `${bottom}px`,
        top: `${top}px`,
        right: `${right}px`,
      }}
    >
      <PlaneIcon />
    </button>
  );
}
