import React from "react";

import styles from "./Corner.module.css";

interface ICornerProps {
  right?: string;
  left?: string;
  rotate?: string;
  borderWidth: string;
  borderColor?: string;
}
export default function Corner({ right, left, rotate, borderWidth, borderColor }: ICornerProps) {
  return <span className={styles.shape} style={{ right, left, rotate, borderWidth, borderColor }}></span>;
}
