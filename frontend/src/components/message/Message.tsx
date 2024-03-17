import Picker from "emoji-picker-react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

import React, { useContext, useEffect, useRef, useState } from "react";

import styles from "./Message.module.css";

import { Context } from "../..";
import Corner from "../../ui/corner/Corner";
import ForwardedMessageIcon from "../../ui/icons/forwarded-message/ForwardedMessageIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import MessageStatus from "../../ui/message-status/MessageStatus";
import { countArrayItems, findUserById } from "../../utils/helpers";
import { files, users } from "../../utils/mockData";

const messageFromMe = {
  marginLeft: "auto",
  borderTopRightRadius: 0,
  backgroundColor: "rgb(193 218 221)",
};

const messageToMe = { borderTopLeftRadius: 0 };

interface IMessage {
  id: string;
  message: string;
  creatorId: string;
  reactions: any;
  createdAt: string;
  forwarded: boolean;
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
  fileId: string;
  setMessageClicked: any;
  isPopupReactionOpen: any;
  openReactionPopup: VoidFunction;
  isPopupMessageActionsOpen: boolean;
  openMessageActionsPopup: VoidFunction;
  isPopupEmojiReactionsOpen: boolean;
  openEmojiReactionsPopup: VoidFunction;
}
const Message = observer(
  ({
    id,
    message,
    creatorId,
    reactions,
    createdAt,
    forwarded,
    isRead,
    isSent,
    isDelivered,
    fileId,
    setMessageClicked,
    isPopupReactionOpen,
    openReactionPopup,
    isPopupMessageActionsOpen,
    openMessageActionsPopup,
    isPopupEmojiReactionsOpen,
    openEmojiReactionsPopup,
  }: IMessage) => {
    const [reactionsCount] = useState(countArrayItems(reactions));
    const userStore = useContext(Context).user;
    const ref = useRef<HTMLParagraphElement>(null);
    const refWrapper = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [height, setHeight] = useState("200px");
    const [file, setFile] = useState<any>({});
    // console.log(ref.current && ref.current?.scrollHeight);
    useEffect(() => {
      if (ref.current && refWrapper.current) {
        if (ref.current?.scrollHeight > refWrapper.current?.clientHeight) {
          setIsCollapsed(true);
        } else setIsCollapsed(false);
      }
    }, [ref.current?.scrollHeight, refWrapper.current?.clientHeight, id]);
    useEffect(() => {
      if (fileId !== "") {
        const file = files.filter((file: any) => file.messageId === id);
        setFile(file[0]);
      }
    }, [fileId, id]);
    // console.log(userStore);
    const toggleHeight = () => {
      setHeight("100%");
      setIsCollapsed(false);
    };
    // console.log(timeStamp);
    return (
      <article
        className={styles.wrapper}
        style={userStore.user.id === creatorId ? messageFromMe : messageToMe}
        onClick={() => setMessageClicked(id)}
        ref={refWrapper}
      >
        <Corner
          right={userStore.user.id === creatorId ? "-15px" : ""}
          left={userStore.user.id !== creatorId ? "-15px" : ""}
          rotate={userStore.user.id === creatorId ? "180deg" : ""}
          borderWidth={userStore.user.id === creatorId ? "10px 15px 0 0" : "0 15px 10px 0"}
          borderColor={userStore.user.id === creatorId ? "transparent rgb(193 218 221) transparent transparent" : ""}
        />
        {forwarded && (
          <span className={styles.forwarded}>
            <ForwardedMessageIcon /> Пересланное сообщение
          </span>
        )}
        {file && file.type === "image" && (
          <img
            src={file.thumbnailPath}
            alt='Картинка'
            className={styles.thumbnailImage}
            onClick={openMessageActionsPopup}
          />
        )}
        <p className={styles.text} onClick={openMessageActionsPopup} ref={ref} style={{ maxHeight: height }}>
          {message}
        </p>
        <MessageStatus isDelivered={true} isRead={true} user={userStore.user.id} creator={creatorId} />
        <span
          className={styles.timeStamp}
          style={{
            right: userStore.user.id === creatorId ? "30px" : "",
            left: userStore.user.id !== creatorId ? "30px" : "",
          }}
        >
          {createdAt}
        </span>
        {isCollapsed && (
          <span
            onClick={toggleHeight}
            className={styles.hideButton}
            style={{
              left: userStore.user.id === creatorId ? "10px" : "",
              right: userStore.user.id !== creatorId ? "10px" : "",
              backgroundColor: userStore.user.id !== creatorId ? "white" : "rgb(193 218 221)",
            }}
          >
            Читать далее...
          </span>
        )}
        {reactions.length > 0 && (
          <div
            className={styles.reaction}
            style={{
              right: userStore.user.id === creatorId ? "25px" : "",
              left: userStore.user.id !== creatorId ? "25px" : "",
            }}
          >
            {reactionsCount.map((el: any, i: number) => {
              return (
                <div key={i} className={styles.counter} onClick={openReactionPopup}>
                  <p>{el.reaction}</p>
                  {reactionsCount.length > 1 && <p className={styles.count}>{el.count}</p>}
                </div>
              );
            })}

            <motion.div
              className={styles.popup}
              style={{
                right: userStore.user.id === creatorId ? "50%" : "",
                left: userStore.user.id !== creatorId ? "50%" : "",
                transformOrigin: userStore.user.id === creatorId ? "right top" : "left top",
              }}
              animate={{ scale: isPopupReactionOpen ? 1 : 0, opacity: isPopupReactionOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className={styles.summary_list}>
                {reactions.map((el: any, i: number) => {
                  return (
                    <li key={i} className={styles.summary_item}>
                      <p className={styles.summary_reaction}>{el.reaction}</p>
                      <p className={styles.summary_name}>
                        {findUserById(users, el.creatorId)[0].username
                          ? findUserById(users, el.creatorId)[0].username
                          : findUserById(users, el.creatorId)[0].email}
                      </p>

                      {findUserById(users, el.creatorId)[0].avatar ? (
                        <img
                          className={styles.summary_avatar}
                          src={findUserById(users, el.creatorId)[0].avatar}
                          alt='Аватар'
                        />
                      ) : (
                        <NoAvatar width={44} height={44} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        )}

        <motion.ul
          className={styles.actions}
          animate={{ height: isPopupMessageActionsOpen ? "auto" : 0, opacity: isPopupMessageActionsOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <li className={styles.action} onClick={openEmojiReactionsPopup}>
            Отреагировать
          </li>
          <li className={styles.action}>Переслать</li>
          {userStore.user.id === creatorId && <li className={styles.action}>Изменить</li>}
          {userStore.user.id === creatorId && <li className={styles.action}>Удалить</li>}
        </motion.ul>

        {isPopupEmojiReactionsOpen && (
          // <Picker reactionsDefaultOpen={true} />
          <Picker
            reactionsDefaultOpen={true}
            className={styles.emoji}
            style={{ position: "absolute", transition: " all 0s linear", backgroundColor: "white" }}
            lazyLoadEmojis={true}
          />
        )}
      </article>
    );
  },
);

export default Message;
