import styles from "./DeleteIcone.module.css";

export default function DeleteIcon({ onClick }: { onClick: VoidFunction }) {
  return (
    <div className={styles.icon} onClick={onClick}>
      <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M19 5L5 19M5.00001 5L19 19'
          stroke='white'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </div>
  );
}
