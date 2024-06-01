import Picker, { EmojiStyle } from "emoji-picker-react";
import { motion, useInView } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import * as moment from "moment";
import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

import styles from "./Message.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import Corner from "../../ui/corner/Corner";
import ForwardedMessageIcon from "../../ui/icons/forwarded-message/ForwardedMessageIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";
import MessageStatus from "../../ui/message-status/MessageStatus";
import { createChat } from "../../utils/api";
import { countArrayItems, findItemById, getFormattedTime } from "../../utils/helpers";
import { IMessage, IMessageStatus } from "../../utils/types";
import MessageFileElement from "../message-file-element/MessageFileElement";
import MessageContactElement from "../messageContactElement/MessageContactElement";
import ParentElement from "../parentElement/ParentElement";

const messageFromMe = {
  marginLeft: "auto",
  borderTopRightRadius: 0,
  backgroundColor: "rgb(193 218 221)",
};

const messageToMe = { borderTopLeftRadius: 0 };

interface IMessageElement {
  id: string;
  message: string;
  file: any;
  parentMessage: IMessage;
  contact: any;
  currentUserId: string;
  recipientUserId: string;
  reactions: any;
  createdAt: string;
  isForwarded: boolean;
  isDeleted: boolean;
  status: IMessageStatus;
  readBy: string[];
  modified: boolean;
  fileId: string;
  setMessageClicked: any;
  isPopupReactionOpen: any;
  openReactionPopup: VoidFunction;
  isPopupMessageActionsOpen: boolean;
  openMessageActionsPopup: VoidFunction;
  isPopupEmojiReactionsOpen: boolean;
  openEmojiReactionsPopup: VoidFunction;
  closeEmojiReactionsPopup: VoidFunction;
  openForwardContactPopup: VoidFunction;
  // closeForwardContactPopup: VoidFunction;
  closeMessageActionsPopup: VoidFunction;
  openPopupEditMessage: VoidFunction;
  // setParentMessage: Dispatch<SetStateAction<string>>;
  scrollToBottom: VoidFunction;
  socket: any;
  roomId: string;
  scrollIntoView: VoidFunction;
  setImageToShow: any;
  setVideoToShow: any;
}
const MessageWithForwardRef = React.forwardRef(
  (
    {
      id,
      message,
      file,
      parentMessage,
      currentUserId,
      recipientUserId,
      contact,
      reactions,
      createdAt,
      isForwarded,
      isDeleted,
      modified,
      status,
      readBy,
      fileId,
      setMessageClicked,
      isPopupReactionOpen,
      openReactionPopup,
      isPopupMessageActionsOpen,
      openMessageActionsPopup,
      openPopupEditMessage,
      // closeForwardContactPopup,
      isPopupEmojiReactionsOpen,
      openEmojiReactionsPopup,
      closeEmojiReactionsPopup,
      openForwardContactPopup,
      closeMessageActionsPopup,
      // setParentMessage,
      scrollToBottom,
      // socket,
      roomId,
      scrollIntoView,
      setImageToShow,
      setVideoToShow,
    }: IMessageElement,
    ref,
  ) =>
    // ref,
    {
      // const refMessage = useRef<HTMLParagraphElement>(null);
      // const [contentEditable, setContentEditable] = useState(false);
      const matchesMobile = useMediaQuery("(max-width: 576px)");
      const matchesTablet = useMediaQuery("(max-width: 768px)");
      const [reactionsCount, setReactionCount] = useState<any>(countArrayItems(reactions));
      const store = useContext(Context).user;
      const socket = useContext(SocketContext);
      const refText = useRef<HTMLParagraphElement>(null);
      const refWrapper = useRef<HTMLDivElement>(null);
      const [isCollapsed, setIsCollapsed] = useState(false);
      const [height, setHeight] = useState("200px");
      const isMessageToGroupChart = roomId === recipientUserId;
      const [author, setAuthor] = useState<any>(null);
      const refMessage = useRef(null);
      const isInView = useInView(refMessage);
      const innerRef = useRef<HTMLDivElement>(null);
      useImperativeHandle(ref, () => innerRef.current!, []);
      // const [file, setFile] = useState<any>({});
      // console.log(reactions.length);
      // console.log("isMessageToGroupChart", isMessageToGroupChart);
      // console.log(toJS(author));
      // console.log(roomId);
      useEffect(() => {
        if (isMessageToGroupChart) {
          setAuthor(
            store.currentRoom.participants.filter(
              (user: any) => user.userId === currentUserId && user.userId !== store.user.id,
            )[0] || null,
          );
        }
      }, [isMessageToGroupChart]);

      useEffect(() => {
        setReactionCount(countArrayItems(reactions));
      }, [reactions]);

      // useEffect(() => {
      //   if (refText.current && refWrapper.current) {
      //     if (refText.current?.scrollHeight > refWrapper.current?.clientHeight) {
      //       setIsCollapsed(true);
      //     } else setIsCollapsed(false);
      //   }
      // }, [refText.current?.scrollHeight, refWrapper.current?.clientHeight, id]);
      useEffect(() => {
        if (refText.current && innerRef.current) {
          // console.log("innerRef.current?.clientHeight", innerRef.current?.clientHeight);
          // console.log("refText.current?.scrollHeight", refText.current?.scrollHeight);
          // console.log("refText.current?.clientHeight", refText.current?.clientHeight);
          if (refText.current?.scrollHeight > refText.current?.clientHeight) {
            setIsCollapsed(true);
          } else setIsCollapsed(false);
        }
      }, [refText.current?.scrollHeight, innerRef.current?.clientHeight, id]);

      // useEffect(() => {
      //   if (fileId !== "") {
      //     const file = files.filter((file: any) => file.messageId == id);
      //     setFile(file[0]);
      //   }
      // }, [fileId, id]);
      const toggleHeight = () => {
        setHeight("100%");
        setIsCollapsed(false);
      };
      const replyToMessage = () => {
        // setParentMessage(findItemById(store.prevMessages, id));
        store.setParentMessage(findItemById(store.prevMessages, id)[0]);
        closeMessageActionsPopup();
        // scrollToBottom();
        // console.log(id);
      };

      const onEmojiClick = (emoji: any) => {
        // moment.locale();
        const reaction = {
          reaction: emoji,
          from: store.user.id,
          messageId: id,
          roomId: roomId,
        };
        socket && socket.emit("react-to-message", reaction);
        closeEmojiReactionsPopup();
        // setReactionCount(countArrayItems(reactions));
      };
      const deleteReaction = () => {
        // moment.locale();
        const reaction = {
          from: store.user.id,
          messageId: id,
          roomId: roomId,
        };
        socket && socket.emit("delete-reaction", reaction);
        closeEmojiReactionsPopup();
        // setReactionCount(countArrayItems(reactions));
      };
      const deleteMessage = () => {
        // moment.locale();
        const data = {
          messageId: id,
          roomId: roomId,
        };
        socket && socket.emit("delete-message", data);
        closeMessageActionsPopup();
        // setReactionCount(countArrayItems(reactions));
      };

      // console.log(store.parentMessage);
      const [hover, setHover] = useState(false);
      const handleHover: MouseEventHandler<any> = (e) => {
        if (e.type === "mouseenter") {
          setHover(true);
        } else setHover(false);
      };
      // const [isInView, setIsInView] = useState(false);

      useEffect(() => {
        if (
          isInView &&
          store.user.id !== currentUserId &&
          // status !== IMessageStatus.READ &&
          !readBy.includes(store.user.id)
        ) {
          const message = {
            messageId: id,
            roomId: roomId,
            readBy: store.user.id,
          };
          socket && socket.emit("update-message-status", message);
          // store.decrementRoomUndeadIndex(roomId);
        }

        // console.log("Element is in view: ", isInView);
      }, [isInView]);

      const addContact = async () => {
        try {
          const chat = await createChat({ usersId: [contact.id, store.user.id] });

          setTimeout(() => {
            if (chat) {
              socket && socket.emit("create-chat", chat);
              // store.clearMessages();
              // store.setContacts();
              // store.setUnreadCount();
            }
            // store.setContacts();
            // store.setUnreadCount();
            // store.setChatingWith(contact);
            // store.clearMessages();

            // setMenuIsOpen(false);
            //   setSearchResult([]);
          }, 0);
        } catch (e: any) {
          console.log(e);
        }
      };
      // console.log(toJS(store.chatingWith));
      // console.log(toJS(author));
      return (
        <motion.article
          className={styles.wrapper}
          style={
            store.user.id === currentUserId
              ? {
                  ...messageFromMe,
                  maxWidth: file ? (matchesMobile ? "70%" : "50%") : matchesTablet ? "85%" : "60%",
                }
              : {
                  ...messageToMe,
                  maxWidth: file ? (matchesMobile ? "70%" : "50%") : matchesTablet ? "85%" : "60%",
                }
          }
          onClick={() => {
            setMessageClicked(id);
          }}
          ref={innerRef}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
          // ref={el => itemsRef.current[i] = el}
        >
          <div ref={refMessage}></div>
          {isMessageToGroupChart && author && store.user.id !== currentUserId && (
            <div className={styles.authorContainer}>
              {author.avatar ? (
                <img className={styles.author_avatar} src={author.avatar} alt='Аватар' />
              ) : (
                <NoAvatar width={24} height={24} />
              )}
              <p className={styles.author_name}>{author.userName ? author.userName : author.email}</p>
            </div>
          )}
          <Corner
            right={store.user.id === currentUserId ? "-15px" : ""}
            left={store.user.id !== currentUserId ? "-15px" : ""}
            rotate={store.user.id === currentUserId ? "180deg" : ""}
            borderWidth={store.user.id === currentUserId ? "10px 15px 0 0" : "0 15px 10px 0"}
            borderColor={store.user.id === currentUserId ? "transparent rgb(193 218 221) transparent transparent" : ""}
          />
          {isForwarded && (
            <span className={styles.forwarded}>
              <ForwardedMessageIcon /> Пересланное сообщение
            </span>
          )}
          {file && !isDeleted && (
            <MessageFileElement
              hover={hover}
              path={file.path}
              type={file.type}
              name={file.name}
              openMessageActionsPopup={openMessageActionsPopup}
              myMessage={store.user.id === currentUserId}
            />
          )}
          {parentMessage && <ParentElement {...parentMessage} onClick={scrollIntoView} />}
          {/* {parentMessage && <ParentElement onClick={scrollIntoView} />} */}
          {!isDeleted && (
            <p className={styles.text} onClick={openMessageActionsPopup} ref={refText} style={{ maxHeight: height }}>
              {message}
            </p>
          )}
          {contact && !isDeleted && (
            <MessageContactElement {...contact} openMessageActionsPopup={openMessageActionsPopup} />
          )}
          {!isDeleted && <MessageStatus status={status} user={store.user.id} creator={currentUserId} />}
          {modified && (
            <span
              className={styles.timeStamp}
              style={{
                right: store.user.id === currentUserId ? "70px" : "",
                left: store.user.id !== currentUserId ? "70px" : "",
              }}
            >
              Изменено
            </span>
          )}
          <span
            className={styles.timeStamp}
            style={{
              right: store.user.id === currentUserId ? "30px" : "",
              left: store.user.id !== currentUserId ? "30px" : "",
            }}
          >
            {getFormattedTime(createdAt)}
          </span>
          {isCollapsed && (
            <span
              onClick={toggleHeight}
              className={styles.hideButton}
              style={{
                left: store.user.id === currentUserId ? "10px" : "",
                right: store.user.id !== currentUserId ? "10px" : "",
                backgroundColor: store.user.id !== currentUserId ? "white" : "rgb(193 218 221)",
              }}
            >
              Читать далее...
            </span>
          )}
          {!isDeleted && reactions.length > 0 && (
            <div
              className={styles.reaction}
              style={{
                right: store.user.id === currentUserId ? "25px" : "",
                left: store.user.id !== currentUserId ? "25px" : "",
              }}
            >
              {reactionsCount.map((el: any, i: number) => {
                return (
                  <span key={i} className={styles.counter} onClick={openReactionPopup}>
                    <p>{el.reaction}</p>
                    {reactionsCount.length > 1 && <p className={styles.count}>{el.count}</p>}
                  </span>
                );
              })}
              {isPopupReactionOpen && (
                <motion.div
                  className={styles.popup}
                  style={{
                    right: store.user.id === currentUserId ? "50%" : "",
                    left: store.user.id !== currentUserId ? "50%" : "",
                    transformOrigin: store.user.id === currentUserId ? "right top" : "left top",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isPopupReactionOpen ? 1 : 0, opacity: isPopupReactionOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className={styles.summary_list}>
                    {reactions.map((el: any, i: number) => {
                      return (
                        <li key={i} className={styles.summary_item}>
                          <p className={styles.summary_reaction}>{el.reaction}</p>
                          <p className={styles.summary_name}>
                            {findItemById(store.contacts.concat(store.user), el.from)[0].userName !== ""
                              ? findItemById(store.contacts.concat(store.user), el.from)[0].userName
                              : findItemById(store.contacts.concat(store.user), el.from)[0].email}
                          </p>

                          {findItemById(store.contacts.concat(store.user), el.from)[0].avatar ? (
                            <img
                              className={styles.summary_avatar}
                              src={findItemById(store.contacts.concat(store.user), el.from)[0].avatar}
                              alt='Аватар'
                            />
                          ) : (
                            <span style={{ marginLeft: "auto" }}>
                              {" "}
                              <NoAvatar width={44} height={44} />
                            </span>
                          )}
                          {el.from === store.user.id && (
                            <span className={styles.delete_reaction} onClick={deleteReaction}>
                              Удалить реакцию
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </div>
          )}
          {isDeleted && (
            <span className={styles.deletedMessage}>
              <TrashIcon width={24} height={24} />
            </span>
          )}
          {isPopupMessageActionsOpen && (
            <motion.ul
              className={styles.actions}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isPopupMessageActionsOpen ? "auto" : 0, opacity: isPopupMessageActionsOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <li className={styles.action} onClick={openEmojiReactionsPopup}>
                Отреагировать
              </li>
              {store.contacts.length > 1 && (
                <li
                  className={styles.action}
                  onClick={() => {
                    openForwardContactPopup();
                    store.setMessageToForward(id);
                  }}
                >
                  Переслать
                </li>
              )}
              <li className={styles.action} onClick={replyToMessage}>
                Ответить
              </li>
              {contact &&
                store.user.id !== contact.id &&
                contact &&
                findIndex(store.contacts, {
                  id: contact.id,
                }) === -1 && (
                  <li className={styles.action} onClick={addContact}>
                    Добавить в контакты
                  </li>
                )}

              {file && file.type.includes("image") && (
                <li
                  className={styles.action}
                  onClick={() => {
                    setImageToShow(file.path);
                    closeMessageActionsPopup();
                  }}
                >
                  Открыть
                </li>
              )}
              {file && file.type.includes("video") && (
                <li
                  className={styles.action}
                  onClick={() => {
                    setVideoToShow(file.path);
                    closeMessageActionsPopup();
                  }}
                >
                  Открыть
                </li>
              )}
              {!contact && store.user.id === currentUserId && (
                <li
                  className={styles.action}
                  onClick={() => {
                    closeMessageActionsPopup();
                    store.setMessageToEdit(id);
                    openPopupEditMessage();
                  }}
                >
                  Редактировать
                </li>
              )}
              {store.user.id === currentUserId && (
                <li className={styles.action} onClick={deleteMessage}>
                  Удалить
                </li>
              )}
            </motion.ul>
          )}

          {isPopupEmojiReactionsOpen && (
            <Picker
              reactionsDefaultOpen={true}
              className={styles.emoji}
              style={{
                position: "absolute",
                transition: " all 0s linear",
                backgroundColor: "white",
                right: store.user.id === currentUserId ? 0 : "",
                left: store.user.id !== currentUserId ? 0 : "",
                width: matchesMobile ? "300px" : "350px",
                height: matchesMobile ? "400px" : "450px",
              }}
              lazyLoadEmojis={true}
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={(emojiData) => {
                // console.log(emojiData);
                onEmojiClick(emojiData.emoji);
              }}
            />
          )}
        </motion.article>
      );
    },
);

const Message = observer(MessageWithForwardRef);
export default Message;
// const ObserverComponentWithForwardRef = observer(ComponentWithForwardRef);
