import React from "react";

import styles from "./Globe.module.css";

export default function Globe() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.sphere}></div>
        <div className={styles.map}>
          <div className={styles.map_back}></div>
          <div className={styles.map_front}></div>
        </div>
      </div>
    </div>
  );
}
