import React, { useEffect, useState } from "react";

import styles from "./Message.module.css";

import Corner from "../../ui/corner/Corner";
import { countArrayItems, findUserById } from "../../utils/helpers";
import { contacts } from "../../utils/mockData";

const messageIn = {
  marginLeft: "auto",
  borderTopRightRadius: 0,
  // backgroundColor: "rgb(183 203 215)",
  // backgroundColor: "rgb(176 205 209)",
  backgroundColor: "rgb(193 218 221)",
};

const messageFrom = { borderTopLeftRadius: 0 };

export default function Message({
  id,
  message,
  from,
  reactions,
  setMessageClicked,
  isPopupReactionOpen,
  openReactionPopup,
  isPopupMessageActionsOpen,
  openMessageActionsPopup,
}: {
  id: string;
  message: string;
  from: string;
  reactions: any;
  setMessageClicked: any;
  isPopupReactionOpen: any;
  openReactionPopup: VoidFunction;
  isPopupMessageActionsOpen: boolean;
  openMessageActionsPopup: VoidFunction;
}) {
  const [reactionsCount] = useState(countArrayItems(reactions));
  return (
    <article
      className={styles.wrapper}
      style={from === "2" ? messageIn : messageFrom}
      onClick={() => setMessageClicked(id)}
    >
      <Corner
        right={from === "2" ? "-15px" : ""}
        left={from !== "2" ? "-15px" : ""}
        rotate={from === "2" ? "180deg" : ""}
        borderWidth={from === "2" ? "10px 15px 0 0" : "0 15px 10px 0"}
        borderColor={from === "2" ? "transparent rgb(193 218 221) transparent transparent" : ""}
      />
      <p className={styles.text} onClick={openMessageActionsPopup}>
        {message}
      </p>
      {reactions.length > 0 && (
        <div
          className={styles.reaction}
          style={{ right: from === "2" ? "25px" : "", left: from !== "2" ? "25px" : "" }}
        >
          {reactionsCount.map((el: any, i: number) => {
            return (
              <div key={i} className={styles.counter} onClick={openReactionPopup}>
                <p>{el.reaction}</p>
                {reactionsCount.length > 1 && <p className={styles.count}>{el.count}</p>}
              </div>
            );
          })}
          {isPopupReactionOpen && (
            <div className={styles.popup} style={{ right: from === "2" ? "50%" : "", left: from !== "2" ? "50%" : "" }}>
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
      {isPopupMessageActionsOpen && (
        <ul className={styles.actions}>
          <li className={styles.action}>Отреагировать</li>
          <li className={styles.action}>Переслать</li>
          {from === "2" && <li className={styles.action}>Изменить</li>}
          {from === "2" && <li className={styles.action}>Удалить</li>}
        </ul>
      )}
    </article>
  );
}
