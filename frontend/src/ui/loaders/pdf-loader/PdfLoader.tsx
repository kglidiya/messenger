import React from "react";

import styles from "./PdfLoader.module.css";

import Loader from "../loader/Loader";

export default function PdfLoader({ color }: { color?: string }) {
  return (
    <div className={styles.wrapper} style={{ backgroundColor: color }}>
      <Loader color='#eae2cc' />
    </div>
  );
}
