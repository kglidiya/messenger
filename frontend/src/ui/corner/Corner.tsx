import React from "react";

import styles from "./Corner.module.css";

interface ICornerProps {
  right?: string;
  left?: string;
  rotate?: string;
  borderWidth: string;
}
export default function Corner({ right, left, rotate, borderWidth }: ICornerProps) {
  return <span className={styles.shape} style={{ right, left, rotate, borderWidth }}></span>;
}
