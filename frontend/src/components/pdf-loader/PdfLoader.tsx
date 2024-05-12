import React from "react";

import styles from "./PdfLoader.module.css";

import Loader from "../../ui/loader/Loader";

export default function PdfLoader({ color }: { color?: string }) {
  return (
    <div className={styles.wrapper} style={{ backgroundColor: color }}>
      <Loader />
    </div>
  );
}
