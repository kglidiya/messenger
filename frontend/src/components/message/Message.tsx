/* eslint-disable react-hooks/exhaustive-deps */
import Picker, { EmojiStyle } from "emoji-picker-react";
import { motion, useInView } from "framer-motion";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";

import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import styles from "./Message.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import AppStore from "../../store/AppStore";
import Corner from "../../ui/corner/Corner";
import ForwardedMessageIcon from "../../ui/icons/forwarded-message/ForwardedMessageIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";
import MessageStatus from "../../ui/message-status/MessageStatus";
import { createChat } from "../../utils/api";
import { countArrayItems, findItemById, getFormattedTime } from "../../utils/helpers";
import {
  IContact,
  IMessage,
  IMessageFile,
  IMessageStatus,
  IReactions,
  IRoomParticipant,
  IUser,
} from "../../utils/types";
import MessageFileElement from "../message-file-element/MessageFileElement";
import MessageContactElement from "../messageContactElement/MessageContactElement";
import ParentElement from "../parent-element/ParentElement";

const messageFromMe = {
  marginLeft: "auto",
  borderTopRightRadius: 0,
  backgroundColor: "rgb(193 218 221)",
};

const messageToMe = { borderTopLeftRadius: 0 };

interface IMessageElement {
  id: string;
  message: string;
  file: IMessageFile | null;
  parentMessage: IMessage;
  contact: IContact | null;
  currentUserId: string;
  recipientUserId: string;
  reactions: IReactions[];
  createdAt: string;
  isForwarded: boolean;
  isDeleted: boolean;
  status: IMessageStatus;
  readBy: string[];
  modified: boolean;
  setMessageClicked: Dispatch<SetStateAction<string>>;
  isPopupReactionOpen: boolean;
  openReactionPopup: VoidFunction;
  isPopupMessageActionsOpen: boolean;
  openMessageActionsPopup: VoidFunction;
  isPopupEmojiReactionsOpen: boolean;
  openEmojiReactionsPopup: VoidFunction;
  closeEmojiReactionsPopup: VoidFunction;
  openForwardContactPopup: VoidFunction;
  closeForwardContactPopup: VoidFunction;
  closeMessageActionsPopup: VoidFunction;
  openPopupEditMessage: VoidFunction;
  scrollToBottom: VoidFunction;
  roomId: string;
  scrollIntoView: (messageId: string) => Promise<void>;
  setImageToShow: Dispatch<SetStateAction<string>>;
  setVideoToShow: Dispatch<SetStateAction<string>>;
}
const MessageWithForwardRef = forwardRef<HTMLDivElement | null, IMessageElement>(
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
      setMessageClicked,
      isPopupReactionOpen,
      openReactionPopup,
      isPopupMessageActionsOpen,
      openMessageActionsPopup,
      openPopupEditMessage,
      isPopupEmojiReactionsOpen,
      openEmojiReactionsPopup,
      closeEmojiReactionsPopup,
      openForwardContactPopup,
      closeMessageActionsPopup,
      roomId,
      scrollIntoView,
      setImageToShow,
      setVideoToShow,
    },
    ref,
  ) => {
    const matchesMobile = useMediaQuery("(max-width: 576px)");
    const matchesTablet = useMediaQuery("(max-width: 768px)");
    const [reactionsCount, setReactionCount] = useState<{ count: number; reaction: string }[]>(
      countArrayItems(reactions),
    );
    const store = useContext(Context)?.store as AppStore;
    const socket = useContext(SocketContext);
    const refText = useRef<HTMLParagraphElement | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hover, setHover] = useState(false);
    const [height, setHeight] = useState("200px");
    const isMessageToGroupChart = roomId === recipientUserId;
    const isMessageToMe = store.user?.id !== currentUserId;
    const [author, setAuthor] = useState<IRoomParticipant | null>(null);
    const refMessage = useRef(null);
    const isInView = useInView(refMessage);
    const innerRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(ref, () => innerRef.current!, []);

    useEffect(() => {
      if (isMessageToGroupChart) {
        setAuthor(
          store.currentRoom?.participants.filter(
            (user) => user.userId === currentUserId && user.userId !== store.user?.id,
          )[0] || null,
        );
      }
    }, [isMessageToGroupChart]);

    useEffect(() => {
      setReactionCount(countArrayItems(reactions));
    }, [reactions]);

    useEffect(() => {
      if (refText.current && innerRef.current) {
        if (refText.current?.scrollHeight > refText.current?.clientHeight) {
          setIsCollapsed(true);
        } else setIsCollapsed(false);
      }
    }, [refText.current?.scrollHeight, innerRef.current?.clientHeight, id]);

    const toggleHeight = () => {
      setHeight("100%");
      setIsCollapsed(false);
    };

    const replyToMessage = () => {
      store.setParentMessage(findItemById(store.prevMessages, id)[0]);
      closeMessageActionsPopup();
    };

    const reactToMessage = (emoji: string) => {
      const reaction = {
        reaction: emoji,
        from: store.user?.id,
        messageId: id,
        roomId: roomId,
      };
      socket && socket.emit("react-to-message", reaction);
      closeEmojiReactionsPopup();
    };

    const deleteReaction = () => {
      const reaction = {
        from: store.user?.id,
        messageId: id,
        roomId: roomId,
      };
      socket && socket.emit("delete-reaction", reaction);
      closeEmojiReactionsPopup();
    };

    const deleteMessage = () => {
      const data = {
        messageId: id,
        roomId: roomId,
      };
      socket && socket.emit("delete-message", data);
      closeMessageActionsPopup();
    };

    const handleHover: MouseEventHandler<HTMLDivElement> = (e) => {
      if (e.type === "mouseenter") {
        setHover(true);
      } else setHover(false);
    };

    useEffect(() => {
      if (isInView && isMessageToMe && !readBy.includes(store.user?.id as string)) {
        const message = {
          messageId: id,
          roomId: roomId,
          readBy: store.user?.id,
        };
        socket && socket.emit("update-message-status", message);
      }
    }, [isInView]);

    const addContact = async () => {
      try {
        const chat = await createChat({ usersId: [contact?.id as string, store.user?.id as string] });

        setTimeout(() => {
          if (chat) {
            socket && socket.emit("create-chat", chat);
          }
        }, 0);
      } catch (e: any) {
        console.log(e);
      }
    };

    return (
      <motion.article
        className={styles.wrapper}
        style={
          !isMessageToMe
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
      >
        <div ref={refMessage}></div>
        {isMessageToGroupChart && author && isMessageToMe && (
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
          right={!isMessageToMe ? "-15px" : ""}
          left={isMessageToMe ? "-15px" : ""}
          rotate={!isMessageToMe ? "180deg" : ""}
          borderWidth={!isMessageToMe ? "10px 15px 0 0" : "0 15px 10px 0"}
          borderColor={!isMessageToMe ? "transparent rgb(193 218 221) transparent transparent" : ""}
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
            isMessageFromMe={!isMessageToMe}
          />
        )}
        {parentMessage && <ParentElement {...parentMessage} onClick={scrollIntoView} />}

        {!isDeleted && (
          <p className={styles.text} onClick={openMessageActionsPopup} ref={refText} style={{ maxHeight: height }}>
            {message}
          </p>
        )}
        {contact && !isDeleted && (
          <MessageContactElement {...contact} openMessageActionsPopup={openMessageActionsPopup} />
        )}
        {!isDeleted && <MessageStatus status={status} user={store.user?.id as string} creator={currentUserId} />}
        {modified && (
          <span
            className={styles.timeStamp}
            style={{
              right: !isMessageToMe ? "70px" : "",
              left: isMessageToMe ? "70px" : "",
            }}
          >
            Изменено
          </span>
        )}
        <span
          className={styles.timeStamp}
          style={{
            right: !isMessageToMe ? "30px" : "",
            left: isMessageToMe ? "30px" : "",
          }}
        >
          {getFormattedTime(createdAt)}
        </span>
        {isCollapsed && (
          <span
            onClick={toggleHeight}
            className={styles.hideButton}
            style={{
              left: !isMessageToMe ? "10px" : "",
              right: isMessageToMe ? "10px" : "",
              backgroundColor: isMessageToMe ? "white" : "rgb(193 218 221)",
            }}
          >
            Читать далее...
          </span>
        )}
        {!isDeleted && reactions.length > 0 && (
          <div
            className={styles.reaction}
            style={{
              right: !isMessageToMe ? "25px" : "",
              left: isMessageToMe ? "25px" : "",
            }}
          >
            {reactionsCount.map((el, i) => {
              return (
                <span key={i} className={styles.counter} onClick={openReactionPopup}>
                  <p>{el.reaction}</p>
                  {reactionsCount.length > 0 && <p className={styles.count}>{el.count}</p>}
                </span>
              );
            })}
            {isPopupReactionOpen && (
              <motion.div
                className={styles.popup}
                style={{
                  right: !isMessageToMe ? "50%" : "",
                  left: isMessageToMe ? "50%" : "",
                  transformOrigin: !isMessageToMe ? "right top" : "left top",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isPopupReactionOpen ? 1 : 0, opacity: isPopupReactionOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ul className={styles.summary_list}>
                  {reactions.map((el, i) => {
                    return (
                      <li key={i} className={styles.summary_item}>
                        <p className={styles.summary_reaction}>{el.reaction}</p>
                        <p className={styles.summary_name}>
                          {findItemById(
                            store.contacts.concat({ ...(store.user as IUser), chatId: store.roomId as string }),
                            el.from,
                          )[0].userName !== ""
                            ? findItemById(
                                store.contacts.concat({ ...(store.user as IUser), chatId: store.roomId as string }),
                                el.from,
                              )[0].userName
                            : findItemById(
                                store.contacts.concat({ ...(store.user as IUser), chatId: store.roomId as string }),
                                el.from,
                              )[0].email}
                        </p>

                        {findItemById(
                          store.contacts.concat({ ...(store.user as IUser), chatId: store.roomId as string }),
                          el.from,
                        )[0].avatar ? (
                          <img
                            className={styles.summary_avatar}
                            src={
                              findItemById(
                                store.contacts.concat({ ...(store.user as IUser), chatId: store.roomId as string }),
                                el.from,
                              )[0].avatar
                            }
                            alt='Аватар'
                          />
                        ) : (
                          <span style={{ marginLeft: "auto" }}>
                            {" "}
                            <NoAvatar width={44} height={44} />
                          </span>
                        )}
                        {el.from === store.user?.id && (
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
              store.user?.id !== contact.id &&
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
            {!contact && !isMessageToMe && (
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
            {!isMessageToMe && (
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
              right: !isMessageToMe ? 0 : "",
              left: isMessageToMe ? 0 : "",
              width: matchesMobile ? "300px" : "350px",
              height: matchesMobile ? "400px" : "450px",
            }}
            lazyLoadEmojis={true}
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={(emojiData) => {
              reactToMessage(emojiData.emoji);
            }}
          />
        )}
      </motion.article>
    );
  },
);

const Message = observer(MessageWithForwardRef);
export default Message;
