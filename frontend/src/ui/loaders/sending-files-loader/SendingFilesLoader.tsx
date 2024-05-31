import React from "react";

import styles from "./SendingFilesLoader.module.css";

export default function SendingFilesLoader() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.loader}></span>
    </div>
  );
}
