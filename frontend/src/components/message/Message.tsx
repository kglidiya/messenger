import React, { useEffect, useState } from "react";

import styles from "./Message.module.css";

import Corner from "../../ui/corner/Corner";
import { countArrayItems, findUserById } from "../../utils/helpers";
import { contacts } from "../../utils/mockData";

const messageIn = {
  marginLeft: "auto",
  borderTopRightRadius: 0,
};

const messageFrom = { borderTopLeftRadius: 0 };

export default function Message({ message, from, reactions }: { message: string; from: string; reactions: any }) {
  const [reactionsCount] = useState(countArrayItems(reactions));
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  // console.log(reactionsCount);
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
      {reactions.length > 0 && (
        <div
          className={styles.reaction}
          style={{ right: from === "2" ? "25px" : "", left: from !== "2" ? "25px" : "" }}
        >
          {reactionsCount.map((el: any, i: number) => {
            return (
              <div key={i} className={styles.counter} onClick={openPopup}>
                <p>{el.reaction}</p>
                {reactionsCount.length > 1 && <p className={styles.count}>{el.count}</p>}
              </div>
            );
          })}
          {isPopupOpen && (
            <div className={styles.popup} style={{ right: from === "2" ? "50%" : "", left: from !== "2" ? "50%" : "" }}>
              <span className={styles.closeBtn} onClick={closePopup}>
                x
              </span>
              <ul className={styles.summary_list}>
                {reactions.map((el: any, i: number) => {
                  return (
                    <li key={i} className={styles.summary_item}>
                      <p className={styles.summary_reaction}>{el.reaction}</p>
                      <p className={styles.summary_name}>{findUserById(contacts, el.from)[0].name}</p>
                      <img
                        className={styles.summary_avatar}
                        src={findUserById(contacts, el.from)[0].avatar}
                        alt='Аватар'
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
