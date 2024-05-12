import React from "react";

import styles from "./MessageStatus.module.css";

import { IMessageStatus } from "../../utils/types";

interface IMessageStatusProps {
  status: IMessageStatus;
  user: string;
  creator: string;
}

export default function MessageStatus({ status, user, creator }: IMessageStatusProps) {
  // console.log(status);
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
          display: status === IMessageStatus.DELIVERED || status === IMessageStatus.READ ? "inline" : "none",
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
                stroke={status !== IMessageStatus.READ ? "#9d9898" : "#3f3fb1"}
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
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
                stroke={status !== IMessageStatus.READ ? "#9d9898" : "#3f3fb1"}
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
