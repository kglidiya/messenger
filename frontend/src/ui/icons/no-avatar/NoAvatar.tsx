import React from "react";

import styles from "./NoAvatar.module.css";

interface INoAvatarProps {
  width: number;
  height: number;
}
export default function NoAvatar({ width, height }: INoAvatarProps) {
  return (
    <div className={styles.wrapper} style={{ width: `${width}px`, height: `${height}px` }}>
      <svg
        fill='#ddd6c7'
        height={`${height - 2}px`}
        width={`${width - 2}px`}
        version='1.1'
        id='Layer_1'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 512'
      >
        {/* <rect width='100%' height='100%' fill='white' /> */}
        <g id='SVGRepo_bgCarrier' strokeWidth='0' />

        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

        <g id='SVGRepo_iconCarrier'>
          {" "}
          <g>
            {" "}
            <g>
              {" "}
              <circle cx='256' cy='114.526' r='114.526' />{" "}
            </g>{" "}
          </g>{" "}
          <g>
            {" "}
            <g>
              {" "}
              <path d='M256,256c-111.619,0-202.105,90.487-202.105,202.105c0,29.765,24.13,53.895,53.895,53.895h296.421 c29.765,0,53.895-24.13,53.895-53.895C458.105,346.487,367.619,256,256,256z' />{" "}
            </g>{" "}
          </g>{" "}
        </g>
      </svg>
    </div>
  );
}
