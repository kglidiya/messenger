import React from "react";

import styles from "./MessageStatus.module.css";

interface IMessageStatusProps {
  isRead?: boolean;
  isSent?: boolean;
  isDelivered?: boolean;
  user: string;
  creator: string;
}

export default function MessageStatus({ isRead, isSent, isDelivered, user, creator }: IMessageStatusProps) {
  return (
    <div
      className={styles.wrapper}
      style={{ right: user === creator ? "5px" : "", left: user !== creator ? "5px" : "" }}
    >
      <svg
        width='18px'
        height='18px'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        style={{
          marginRight: "-13px",
          display: !isDelivered ? "none" : "inline",
        }}
      >
        <g id='SVGRepo_bgCarrier' strokeWidth='0' />

        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

        <g id='SVGRepo_iconCarrier'>
          <title>i</title>{" "}
          <g id='Complete'>
            <g id='tick'>
              <polyline
                points='3.7 14.3 9.6 19 20.3 5'
                fill='none'
                stroke={!isRead ? "#9d9898" : "#3f3fb1"}
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
            </g>
          </g>
        </g>
      </svg>
      <svg width='18px' height='18px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='none'>
        <g id='SVGRepo_bgCarrier' strokeWidth='0' />

        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

        <g id='SVGRepo_iconCarrier'>
          <title>i</title>{" "}
          <g id='Complete'>
            <g id='tick'>
              <polyline
                points='3.7 14.3 9.6 19 20.3 5'
                fill='none'
                stroke={!isRead ? "#9d9898" : "#3f3fb1"}
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
