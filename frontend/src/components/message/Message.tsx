import React from "react";

import styles from "./Message.module.css";

import Corner from "../../ui/corner/Corner";

const messageIn = {
  marginLeft: "auto",
  borderTopRightRadius: 0,
};

const messageFrom = { borderTopLeftRadius: 0 };

export default function MessageFrom({ message, from }: { message: string; from: string }) {
  return (
    <article
      className={styles.wrapper}
      style={from === "2" ? messageIn : messageFrom}
      // style={t}
    >
      <Corner
        right={from === "2" ? "-15px" : ""}
        left={from !== "2" ? "-15px" : ""}
        rotate={from === "2" ? "180deg" : ""}
        borderWidth={from === "2" ? "10px 15px 0 0" : "0 15px 10px 0"}
      />
      <p className={styles.text}>{message}</p>
    </article>
  );
}
