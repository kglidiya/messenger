import styles from "./CloseIcone.module.css";

export default function CloseIcon({
  width,
  height,
  color,
  onClick,
  bottom,
  top,
  left,
  right,
}: {
  width: number;
  height: number;
  color: string;
  onClick: VoidFunction;
  bottom?: number;
  top?: number;
  left?: number;
  right?: number;
}) {
  return (
    <div
      className={styles.icon}
      onClick={onClick}
      style={{
        bottom: `${bottom}px`,
        top: `${top}px`,
        left: `${left}px`,
        right: `${right}px`,
      }}
    >
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M19 5L5 19M5.00001 5L19 19'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  );
}
