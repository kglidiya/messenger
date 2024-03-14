import styles from "./ShareIcone.module.css";

export default function ShareIcon({ onClick }: { onClick: VoidFunction }) {
  return (
    <div className={styles.icon} onClick={onClick}>
      <svg
        fill='#ddd6c7'
        width='48px'
        height='48px'
        viewBox='0 0 32 32'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='SVGRepo_bgCarrier' strokeWidth='0' />

        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

        <g id='SVGRepo_iconCarrier'>
          {" "}
          <title>share</title>{" "}
          <path d='M0 25.472q0 2.368 1.664 4.032t4.032 1.664h18.944q2.336 0 4-1.664t1.664-4.032v-8.192l-3.776 3.168v5.024q0 0.8-0.544 1.344t-1.344 0.576h-18.944q-0.8 0-1.344-0.576t-0.544-1.344v-18.944q0-0.768 0.544-1.344t1.344-0.544h9.472v-3.776h-9.472q-2.368 0-4.032 1.664t-1.664 4v18.944zM5.696 19.808q0 2.752 1.088 5.28 0.512-2.944 2.24-5.344t4.288-3.872 5.632-1.664v5.6l11.36-9.472-11.36-9.472v5.664q-2.688 0-5.152 1.056t-4.224 2.848-2.848 4.224-1.024 5.152zM32 22.080v0 0 0z' />{" "}
        </g>
      </svg>
    </div>
  );
}
