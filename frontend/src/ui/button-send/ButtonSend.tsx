import React from "react";

import styles from "./ButtinSend.module.css";

import PlaneIcon from "../icons/plane/PlaneIcon";

export default function ButtonSend() {
  return (
    <button className={styles.button}>
      <PlaneIcon />
    </button>
  );
}
