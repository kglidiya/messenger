/* eslint-disable react-hooks/exhaustive-deps */
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { findIndex } from "lodash";
import { observer } from "mobx-react-lite";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { SwipeEventData, useSwipeable } from "react-swipeable";

import { Socket } from "socket.io-client";

import styles from "./Chart.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import useDebounce from "../../hooks/useDebounce";
import { useIsFirstRender } from "../../hooks/useIsFirstRender";
import useMediaQuery from "../../hooks/useMediaQuery";
import AppStore from "../../store/AppStore";
import ButtonScrollToBottom from "../../ui/button-scroll-to-bottom/ButtonScrollToBottom";
import ButtonSend from "../../ui/button-send/ButtonSend";
import DetailsButton from "../../ui/details-button/DetaillsButton";
import Globe from "../../ui/globe/Globe";
import EmojiIcon from "../../ui/icons/emoji/EmojiIcon";
import NavBackIcon from "../../ui/icons/nav-back-icon/NavBackIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import InputFile from "../../ui/input-file/InputFile";
import HourGlassLoader from "../../ui/loaders/hour-glass-loader/HourGlassLoader";
import Loader from "../../ui/loaders/loader/Loader";
import Textarea from "../../ui/textarea/Textarea";
import { getMessageIndex, getPrevMessage, sendFile } from "../../utils/api";
import {
  countLines,
  creactFileToSend,
  decryptAllMessages,
  decryptOneMessage,
  encrypt,
  getDate,
} from "../../utils/helpers";
import { IMessage, IRoom, IUser, IWhoIsTyping } from "../../utils/types";
import Message from "../message/Message";
import OverLay from "../overlay/Overlay";
import ContactDetails from "../popup-contact-details/ContactDetails";
import PopupFoward from "../popup-foward/PopupFoward";
import PopupGroupDetails from "../popup-group-details/PopupGroupDetails";
import PopupImage from "../popup-image/PopupImage";
import PopupSearchMessage from "../popup-search-message/PopupSearchMessage";
import ReplyToElement from "../reply-to-element/ReplyToElement";
import TypingIndicator from "../typing-indicator/TypingIndicator";

const { v4: uuidv4 } = require("uuid");

const Chart = observer(
  ({
    setIsLoadingMessages,
    isLoadingMessages,
    isContactsVisible,
    setIsContactsVisible,
    setIsLoadingContacts,
  }: {
    setIsLoadingMessages: Dispatch<SetStateAction<boolean>>;
    isLoadingMessages: boolean;
    isContactsVisible: boolean;
    setIsContactsVisible: Dispatch<SetStateAction<boolean>>;
    setIsLoadingContacts: Dispatch<SetStateAction<boolean>>;
  }) => {
    const store = useContext(Context)?.store as AppStore;
    const socket = useContext(SocketContext) as Socket;
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [value, setValue] = useState("");
    const [caretPos, setCaretPos] = useState(0);
    const [rows, setRows] = useState(2);
    const [imageSrc, setImageSrc] = useState("");
    const [imageToShow, setImageToShow] = useState("");
    const [videoToShow, setVideoToShow] = useState("");
    const [isPopupFileOpen, setIsPopupFileOpen] = useState(false);
    const [messageClicked, setMessageClicked] = useState("");
    const [isPopupAttachFileOpen, setIsPopupAttachFileOpen] = useState(false);
    const [filesToSend, setFilesToSend] = useState<FileList | []>([]);
    const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
    const [fileFromClipboard, setFileFromClipboard] = useState<File | null>(null);
    const [isSendingFiles, setSendingFiles] = useState(false);
    const [isPopupReactionOpen, setIsPopupReactionOpen] = useState(false);
    const [isPopupMessageActionsOpen, setIsPopupMessageActionsOpen] = useState(false);
    const [isPopupEmojiReactionsOpen, setIsPopupEmojiReactionsOpen] = useState(false);
    const [isPopupDetailsOpen, setIsPopupDetailsOpen] = useState(false);
    const [isPopupForwardOpen, setIsPopupForwardOpen] = useState(false);
    const [isPopupSearchMessageOpen, setIsPopupSearchMessageOpen] = useState(false);
    const [isPopupEditMessage, setIsPopupEditMessage] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUserData, setTypingUserData] = useState<IWhoIsTyping | null>(null);
    const [newMessagesNotification, setNewMessagesNotification] = useState(false);
    const [limit, setLimit] = useState(15);
    const [offsetNext, setOffsetNext] = useState<number>(0);
    const [offsetPrev, setOffsetPrev] = useState<number>(0);
    const [fetching, setFetching] = useState(false);
    const [fetchNext, setFetchNext] = useState(false);
    const [fetchPrev, setFetchPrev] = useState(true);
    const refAnchor = useRef<HTMLDivElement>(null);
    const refChart = useRef<HTMLDivElement | null>(null);
    const refMessages = useRef<HTMLDivElement | null>(null);
    const refTextArea = React.useRef<HTMLTextAreaElement>(null);
    const itemsRef = useRef<HTMLDivElement[] | null>([]);
    const [scroll, setScroll] = useState<number | undefined>();
    const [focused, setFocused] = React.useState(false);
    const matchesMobile = useMediaQuery("(max-width: 576px)");
    // const matchesTablet = useMediaQuery("(max-width: 768px)");
    const isFirstRender = useIsFirstRender();
    const refPassthrough = (el: any) => {
      handlers.ref(el);
      refMessages.current = el;
    };
    const resetFetchParams = () => {
      setFetching(true);
      setFetchPrev(true);
      setOffsetPrev(0);
      setOffsetNext(0);
      setLimit(15);
    };

    useEffect(() => {
      if (itemsRef.current) {
        itemsRef.current = itemsRef.current.slice(0, store.prevMessages.length);
      }
    }, [store.prevMessages.length]);

    const fetchMessages = async () => {
      if (offsetNext === 0 && offsetPrev === 0) {
        setIsLoadingMessages(true);
      }
      try {
        const res = await getPrevMessage({
          limit,
          offset: fetchNext ? offsetNext : offsetPrev,
          roomId: store.roomId as string,
        });

        const messages = res.reverse();
        const decryptedMessages = decryptAllMessages(messages);
        if (offsetNext === 0 && offsetPrev === 0) {
          setIsLoadingMessages(false);
        }
        if (fetchPrev) {
          store.setMessages([...decryptedMessages, ...store.prevMessages]);
        }
        if (fetchNext) {
          store.setMessages([...store.prevMessages, ...decryptedMessages]);
        }
        setTimeout(() => {
          setFetching(false);
          setFetchNext(false);
          setFetchPrev(false);
        }, 0);
      } catch (err) {
        console.error("Произошла ошибка:", err);
      }
    };
    useEffect(() => {
      const setChatWidth = () => {
        const doc = document.documentElement;
        const width = refChart.current?.clientWidth;
        const height = refChart.current?.clientHeight;
        if (height && width) {
          doc.style.setProperty("--chat-width", `${height > width ? width : height}px`);
        }
      };
      if (!isContactsVisible) {
        setChatWidth();
      }
      setChatWidth();
      window.addEventListener("resize", setChatWidth);

      return () => {
        window.removeEventListener("resize", setChatWidth);
      };
    }, [isContactsVisible]);

    const scrollToBottom = () => {
      if (itemsRef.current && store.prevMessages.length) {
        const lastMessage = store.prevMessages[store.prevMessages.length - 1].id;
        if (store.currentRoom?.lastMessageId === lastMessage) {
          itemsRef.current[store.prevMessages.length - 1].scrollIntoView({
            behavior: "auto",
          });
        } else {
          store.clearMessages();
          resetFetchParams();
        }
      }

      setScroll(document.documentElement.clientHeight);
    };

    const scrollMessageIntoView = async (messageId: string) => {
      const targetMessage = store.prevMessages.findIndex((el) => el.id === messageId);

      if (itemsRef.current && targetMessage !== -1) {
        itemsRef.current[targetMessage].scrollIntoView({ behavior: "smooth" });
      } else {
        const index = await getMessageIndex({ id: messageId, roomId: store.roomId as string });

        if (index >= 0) {
          store.clearMessages();

          if (index >= 30) {
            setOffsetPrev(index - (limit - 1));
            setOffsetNext(index - (limit - 1) - limit);
          }
          if (index >= 15 && index < 30) {
            setOffsetPrev(index - (limit - 1));
            setOffsetNext(0);
          }
          if (index < 15) {
            setOffsetPrev(0);
            setOffsetNext(0);
            setLimit(index + 1);
          }

          setFetching(true);
          setFetchPrev(true);
        }
      }
    };

    useEffect(() => {
      if (store.isAuth) {
        store.setContacts(setIsLoadingContacts);
        const data = {
          userId: store.user?.id,
          isOnline: true,
        };

        socket && socket.emit("update-userData", data);
      }
    }, [store.isAuth]);

    useEffect(() => {
      if (store.contacts.length) {
        if (store.chatingWith) {
          store.setChatingWith(store.contacts[store.contacts.length - 1]);
        } else store.setChatingWith(store.contacts[0]);
      }
    }, [store.contacts.length]);

    useEffect(() => {
      if (store.chatingWith) {
        setValue("");
        store.setCurrentRoom(store.chatingWith.chatId);
        if (!matchesMobile) {
          refTextArea.current?.focus();
        }
      }
    }, [store.chatingWith]);

    useEffect(() => {
      if (store.currentRoom) {
        store.setRoomId(store.currentRoom?.id);
      }
    }, [store.currentRoom]);

    useEffect(() => {
      if (store.roomId) {
        if (store.currentRoom && store.currentRoom.firstUnreadMessage) {
          scrollMessageIntoView(store.currentRoom.firstUnreadMessage);
          setNewMessagesNotification(true);
        } else {
          resetFetchParams();
        }

        socket && socket.emit("meeting", { roomId: store.roomId });
        if (isPopupDetailsOpen) {
          closeDetailsPopup();
        }
        if (isPopupSearchMessageOpen) {
          closeSearchMessagePopup();
        }
      }
    }, [store.roomId]);

    useEffect(() => {
      if (offsetNext === 0 && offsetPrev === limit && store.prevMessages.length > 0) {
        setTimeout(() => {
          scrollToBottom();
        }, 20);
      }
    }, [store.prevMessages.length, offsetNext]);

    useEffect(() => {
      socket.on("meeting", () => {});

      socket.on("receive-message", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          if (store.prevMessages.length) {
            const lastMessage = store.prevMessages[store.prevMessages.length - 1].id;
            if (store.currentRoom?.lastMessageId !== lastMessage) {
              store.clearMessages();
              resetFetchParams();
            } else {
              store.addMessage(decryptOneMessage(message));
              setOffsetPrev((prev) => prev + 1);
            }
          } else {
            store.addMessage(decryptOneMessage(message));
            setOffsetPrev((prev) => prev + 1);
          }

          store.updateCurrentRoomLastMsgId(message.id);
          setTimeout(() => {
            scrollToBottom();
          }, 20);
        }
        store.incrementUnreadCount(message);
      });

      socket.on("receive-reaction", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          store.updateMessage(decryptOneMessage(message));
        }
      });

      socket.on("receive-message-status", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          store.updateMessage(decryptOneMessage(message));
        }
        store.decrementUnreadCount(message);
      });

      socket.on("receive-updatedMessage", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          store.updateMessage(decryptOneMessage(message));
        }
      });

      socket.on("receive-message-deleted", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          store.updateMessage(message);
        }
      });

      socket.on("receive-typingState", (typingState: IWhoIsTyping) => {
        if (store.roomId === typingState.roomId && typingState.userId !== store.user?.id) {
          setTypingUserData(typingState);
        } else setTypingUserData(null);
      });

      socket.on("receive-userData", (user: IUser) => {
        if (
          store.isAuth &&
          (findIndex(store.contacts, {
            id: user.id,
          }) !== -1 ||
            user.id === store.user?.id)
        ) {
          store.updateUserData(user);
        }
      });

      socket.on("receive-newChatData", (res: string) => {
        if (res.includes(store.user?.id as string)) {
          store.setContacts();
          store.clearMessages();
        }
      });

      socket.on("receive-groupData", (groupData: IRoom) => {
        const participant = groupData.participants.filter((el) => el.userId === store.user?.id)[0];
        const isGroupInContacts = store.contacts.findIndex((el) => el.chatId === groupData.id) !== -1;
        if (participant && !participant.isDeleted && isGroupInContacts) {
          store.updateGroup(groupData);
        }
        if (participant && !participant.isDeleted && !isGroupInContacts) {
          store.clearMessages();
          store.setContacts();
        }
        if (participant && participant.isDeleted && isGroupInContacts) {
          store.clearMessages();
          store.setContacts();
          store.setChatingWith(null);
          store.setCurrentRoom(null);
        }
      });
    }, []);

    const sendMessage = () => {
      if (value) {
        const message = {
          id: uuidv4(),
          currentUserId: store.user?.id,
          recipientUserId: store.chatingWith?.email ? store.chatingWith?.id : store.roomId,
          message: encrypt(value),
          parentMessage:
            (store.parentMessage && store.parentMessage.message
              ? { ...store.parentMessage, message: encrypt(store.parentMessage.message) }
              : store.parentMessage) || null,
          roomId: store.roomId,
          readBy: store.user?.id,
        };

        socket && socket.emit("send-message", message);

        setTimeout(() => {
          setValue("");
          setRows(2);
          refTextArea.current?.focus();
          if (store.parentMessage) {
            store.setParentMessage(null);
          }
          if (isEmojiOpen) {
            setIsEmojiOpen(false);
          }
        }, 0);
      }
    };
    const editMessage = () => {
      if (value) {
        const message = {
          ...store.messageToEdit,
          message: encrypt(value),
        };

        socket && socket.emit("edit-message", message);

        setTimeout(() => {
          setValue("");
          setRows(2);
          store.clearMessageToEdit();
          closePopupEditMessage();
        }, 0);
      }
    };

    useEffect(() => {
      if (store.messageToEdit) {
        setValue(store.messageToEdit.message);
      }
    }, [store.messageToEdit]);

    const openReactionPopup = () => {
      setIsPopupReactionOpen(true);
      closeMessageActionsPopup();
    };
    const closeReactionPopup = () => {
      setIsPopupReactionOpen(false);
    };
    const openDetailsPopup = () => {
      setIsPopupDetailsOpen(true);
      closeMessageActionsPopup();
    };
    const closeDetailsPopup = () => {
      setIsPopupDetailsOpen(false);
    };
    const openMessageActionsPopup = () => {
      setIsPopupMessageActionsOpen(true);
      closeReactionPopup();
    };
    const closeMessageActionsPopup = () => {
      setIsPopupMessageActionsOpen(false);
    };

    const openEmojiReactionsPopup = () => {
      setIsPopupEmojiReactionsOpen(true);
      closeMessageActionsPopup();
    };
    const closeEmojiReactionsPopup = () => {
      setIsPopupEmojiReactionsOpen(false);
    };

    const openForwardContactPopup = () => {
      setIsPopupForwardOpen(true);
      closeMessageActionsPopup();
      closeDetailsPopup();
    };
    const closeForwardContactPopup = () => {
      setIsPopupForwardOpen(false);
    };
    const openSearchMessagePopup = () => {
      setIsPopupSearchMessageOpen(true);
    };
    const closeSearchMessagePopup = () => {
      setIsPopupSearchMessageOpen(false);
    };

    const openPopupEditMessage = () => {
      setIsPopupEditMessage(true);
    };
    const closePopupEditMessage = () => {
      setIsPopupEditMessage(false);
    };

    const closePopupFile = () => {
      setIsPopupFileOpen(false);
    };

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      setCaretPos(target.selectionStart as number);
      setValue(target.value);
      const newLines = countLines(target);
      if (!newLines) setRows(2);
      if (newLines < 10) setRows(newLines + 1);
      else setRows(10);
    };

    useEffect(() => {
      if (value && focused) {
        setIsTyping(true);
      } else setIsTyping(false);
    }, [value, focused]);

    useEffect(() => {
      if (store.roomId) {
        socket.emit("update-typingState", { roomId: store.roomId, userId: store.user?.id, isTyping: isTyping });
      }
    }, [isTyping]);

    const onEmojiClick = (emoji: string) => {
      setValue(value.slice(0, caretPos) + emoji + value.slice(caretPos));
    };

    const emojiToggle = () => {
      setIsEmojiOpen(!isEmojiOpen);
    };

    const sendMessageFromInputFile = async (files: FileList) => {
      for (let index = 0; index < files.length; index++) {
        const form = new FormData();
        if (
          (!(filesToRemove.indexOf(files[index].name) !== -1) || filesToRemove.length === 0) &&
          files[index].size < 104857600
        ) {
          setSendingFiles(true);
          form.append("file", files[index]);
          const data = {
            currentUserId: store.user?.id as string,
            recipientUserId: store.chatingWith?.email ? (store.chatingWith?.id as string) : (store.roomId as string),
            message: index === 0 && value ? encrypt(value) : "",
            roomId: store.roomId as string,
            readBy: store.user?.id as string,
          };
          for (let key in data) {
            form.append(key, data[key as keyof typeof data]);
          }

          const message = await sendFile(form);

          setTimeout(() => {
            socket.emit("send-file", message);
            store.incrementFilesCounter();
            if (isEmojiOpen) {
              setIsEmojiOpen(false);
            }

            setValue("");
            setRows(2);
          }, 0);
        }
      }
      //setIsPopupAttachFileOpen(false);
      setFilesToRemove([]);
      store.setFilesCounter(0);
      setSendingFiles(false);
      setIsPopupAttachFileOpen(false);
      //setFilesCounter(0);
    };

    const handleImagePaste = async () => {
      try {
        if (!navigator.clipboard) {
          console.error("Копирование и вставка не работает в данном браузере");
          return;
        }
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
          const imageTypes = clipboardItem.types.find((type) => type.startsWith("image/"));
          if (imageTypes) {
            const blob = await clipboardItem.getType(imageTypes);
            setFileFromClipboard(creactFileToSend(blob, "image/png"));
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
            setIsPopupFileOpen(true);
            setIsEmojiOpen(false);
            break;
          }
        }
      } catch (err) {
        console.error("Произошла ошибка", err);
      }
    };

    const sendFileFromClipboard = async () => {
      setSendingFiles(true);
      const file = creactFileToSend(fileFromClipboard as File, "image/png");
      const form = new FormData();
      form.append("file", file);
      const data = {
        currentUserId: store.user?.id as string,
        recipientUserId: store.chatingWith?.email ? (store.chatingWith?.id as string) : (store.roomId as string),
        message: value ? encrypt(value) : "",
        roomId: store.roomId as string,
        readBy: store.user?.id as string,
      };
      for (let key in data) {
        form.append(key, data[key as keyof typeof data]);
      }

      const message = await sendFile(form);
      setTimeout(() => {
        socket.emit("send-file", message);
        setValue("");
        setRows(2);
        setSendingFiles(false);
        setFileFromClipboard(null);
        if (isEmojiOpen) {
          setIsEmojiOpen(false);
        }
        setIsPopupFileOpen(false);
      }, 0);
    };

    const scrollHander = (e: WheelEvent) => {
      refMessages.current && setScroll(refMessages.current?.scrollHeight - refMessages.current?.scrollTop);
      const chartHeight = refMessages.current?.scrollHeight;
      const chartBottomPos =
        refMessages.current &&
        refChart.current &&
        refMessages.current?.scrollTop + refChart.current?.scrollHeight - 150;
      if (e.deltaY < 0 || e.deltaY > 0) {
        setNewMessagesNotification(false);
      }

      if (
        store.prevMessages.length &&
        refMessages.current &&
        refMessages.current?.scrollTop < 100 &&
        store.prevMessages[0].id !== store.currentRoom?.firstMessageId
      ) {
        if ((matchesMobile && e.deltaY > 0) || (!matchesMobile && e.deltaY < 0)) {
          setFetchPrev(true);
          setFetchNext(false);
          setFetching(true);
        }
      }

      if (
        store.prevMessages.length &&
        store.prevMessages[store.prevMessages.length - 1].id !== store.currentRoom?.lastMessageId &&
        chartBottomPos &&
        chartHeight &&
        chartBottomPos - chartHeight > 0
      ) {
        if ((matchesMobile && e.deltaY < 0) || (!matchesMobile && e.deltaY > 0)) {
          setFetchNext(true);
          setFetchPrev(false);
          setFetching(true);
        }
      }
    };
    const optimizeScrolldHandler = useDebounce(scrollHander, 100);
    useEffect(() => {
      const chart = refMessages.current;
      chart && chart.addEventListener("wheel", optimizeScrolldHandler);
      return function () {
        chart && chart.removeEventListener("wheel", optimizeScrolldHandler);
      };
    }, [store.currentRoom]);

    const handlers = useSwipeable({
      onSwipedDown: (e: SwipeEventData) => {
        optimizeScrolldHandler(e);
      },
      onSwipedUp: (e: SwipeEventData) => {
        optimizeScrolldHandler(e);
      },
    });

    useEffect(() => {
      if (fetching) {
        if (fetchPrev) {
          if (isFirstRender) {
            setOffsetPrev(limit);
          } else
            setOffsetPrev((prev) => {
              if (limit > 15) {
                setLimit(15);
              }
              if (offsetNext === 0 && prev > 0 && prev < 15) {
                setLimit(offsetPrev);
              }
              return prev + limit;
            });
        }
        if (fetchNext) {
          if (offsetNext === 0) {
            setLimit(15);
          }
          if (offsetNext > 0 && offsetNext < 15) {
            setLimit(offsetNext);
            setOffsetNext(0);
          }
          if (offsetNext >= 15) {
            setLimit(15);
            setOffsetNext(offsetNext - 15);
          }
        }
        setTimeout(() => {
          fetchMessages();
        }, 0);
      }
    }, [fetching]);

    useEffect(() => {
      const sendMsgWithHotKeys = (e: KeyboardEvent) => {
        if (
          !isPopupAttachFileOpen &&
          !isPopupFileOpen &&
          !isPopupEditMessage &&
          value &&
          e.key === "Enter" &&
          e.ctrlKey
        ) {
          sendMessage();
        }
        if (isPopupFileOpen && e.key === "Enter" && e.ctrlKey) {
          sendFileFromClipboard();
        }
        if (isPopupAttachFileOpen && e.key === "Enter" && e.ctrlKey) {
          sendMessageFromInputFile(filesToSend as FileList);
        }
        if (isPopupEditMessage && e.key === "Enter" && e.ctrlKey) {
          editMessage();
        }
      };

      document.addEventListener("keydown", sendMsgWithHotKeys);
      return () => {
        document.removeEventListener("keydown", sendMsgWithHotKeys);
      };
    }, [value, isPopupAttachFileOpen, isPopupFileOpen]);

    useEffect(() => {
      if (store.parentMessage) {
        refTextArea.current?.focus();
      }
    }, [store.parentMessage]);

    const closeAllPopups = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (target.nodeName === "DIV") {
        setIsEmojiOpen(false);
        closeReactionPopup();
        closeMessageActionsPopup();
        store.setMessageToForward(null);
        store.setContactToForward(null);
        store.clearSelectedUsers();
        closeEmojiReactionsPopup();
        closeDetailsPopup();
        closeForwardContactPopup();
        closeSearchMessagePopup();
      }
    };
    return (
      <div
        className={styles.wrapper}
        onClick={closeAllPopups}
        ref={refChart}
        style={{
          width: matchesMobile ? (!isContactsVisible ? "100%" : 0) : "",
          visibility: matchesMobile ? (!isContactsVisible ? "visible" : "hidden") : "visible",
          display: matchesMobile ? (!isContactsVisible ? "block" : "none") : "",
        }}
      >
        {store.chatingWith && (
          <div className={styles.contact}>
            {matchesMobile && <NavBackIcon onClick={() => setIsContactsVisible(true)} />}

            {store.chatingWith.avatar ? (
              <img src={store.chatingWith.avatar} alt='Аватар' className={styles.contact__avatar} />
            ) : (
              <NoAvatar width={44} height={44} />
            )}
            <div className={styles.details}>
              <p className={styles.contact__name}>
                {store.chatingWith.userName ? store.chatingWith.userName : store.chatingWith.email}
              </p>

              {store.chatingWith.email && store.chatingWith.isOnline && <p className={styles.isOnline}>В сети</p>}
              {store.chatingWith.email && !store.chatingWith.isOnline && <p className={styles.isOnline}>Не в сети</p>}
            </div>
            <span className={styles.searchIcon} onClick={openSearchMessagePopup}>
              {" "}
              <SearchIcon color='white' />
            </span>

            <DetailsButton onClick={openDetailsPopup} />

            {store.chatingWith && store.chatingWith.email && (
              <ContactDetails
                {...store.chatingWith}
                onClick={() => {
                  if (store.contacts.length > 1) {
                    store.setContactToForward(store.chatingWith);
                    openForwardContactPopup();
                  }
                }}
                isPopupDetailsOpen={isPopupDetailsOpen}
              />
            )}
            {store.currentRoom && !store.chatingWith.email && (
              <PopupGroupDetails isPopupDetailsOpen={isPopupDetailsOpen} closeDetailsPopup={closeDetailsPopup} />
            )}
          </div>
        )}
        {(store.contacts.length === 0 || !store.chatingWith) && <div className={styles.contactNone} />}
        <div
          className={styles.content}
          style={{
            height: `calc(100% - 200px - ${rows * 18}px)`,
          }}
          {...handlers}
          ref={refPassthrough}
        >
          {isLoadingMessages && (
            <div style={{ marginTop: matchesMobile ? "38%" : "25vh" }}>
              <Loader color='white' />
            </div>
          )}
          {newMessagesNotification && <p className={styles.newMessagesNotification}>Новые сообщения</p>}
          {store.prevMessages.length > 0 &&
            store.prevMessages.map((message, i: number, arr) => {
              return (
                <React.Fragment key={message.id}>
                  {i === 0 && <p className={styles.messageDate}>{getDate(message.createdAt)}</p>}
                  {i > 0 && getDate(arr[i].createdAt) !== getDate(arr[i - 1].createdAt) && (
                    <p className={styles.messageDate}>{getDate(message.createdAt)}</p>
                  )}
                  <Message
                    {...message}
                    setMessageClicked={setMessageClicked}
                    isPopupReactionOpen={isPopupReactionOpen && messageClicked === message.id}
                    openReactionPopup={openReactionPopup}
                    isPopupMessageActionsOpen={isPopupMessageActionsOpen && messageClicked === message.id}
                    openMessageActionsPopup={openMessageActionsPopup}
                    isPopupEmojiReactionsOpen={isPopupEmojiReactionsOpen && messageClicked === message.id}
                    openEmojiReactionsPopup={openEmojiReactionsPopup}
                    closeEmojiReactionsPopup={closeEmojiReactionsPopup}
                    openForwardContactPopup={openForwardContactPopup}
                    closeForwardContactPopup={closeForwardContactPopup}
                    closeMessageActionsPopup={closeMessageActionsPopup}
                    openPopupEditMessage={openPopupEditMessage}
                    scrollToBottom={scrollToBottom}
                    roomId={store.roomId as string}
                    ref={(el: HTMLDivElement) => {
                      if (itemsRef.current) {
                        return (itemsRef.current[i] = el);
                      }
                    }}
                    scrollIntoView={scrollMessageIntoView}
                    setImageToShow={setImageToShow}
                    setVideoToShow={setVideoToShow}
                  />
                </React.Fragment>
              );
            })}

          <div ref={refAnchor} style={{ height: "250px" }}></div>
        </div>

        <Globe />

        {scroll && scroll > document.documentElement.clientHeight + 200 && (
          <ButtonScrollToBottom onClick={scrollToBottom} />
        )}

        <div style={{ position: "relative" }}>
          <div className={styles.container}>
            <EmojiIcon onClick={emojiToggle} />
            {store.chatingWith && store.chatingWith.email && typingUserData && typingUserData.isTyping && (
              <TypingIndicator
                avatar={store.chatingWith.avatar}
                email={store.chatingWith.email}
                userName={store.chatingWith.userName}
              />
            )}
            {store.chatingWith &&
              !store.chatingWith.email &&
              typingUserData &&
              typingUserData.isTyping &&
              store.currentRoom?.participants.map((user) => {
                if (user.userId === typingUserData.userId) {
                  return (
                    <TypingIndicator
                      key={user.userId}
                      avatar={user.avatar}
                      email={user.email}
                      userName={user.userName}
                    />
                  );
                }
              })}

            {store.parentMessage && <ReplyToElement {...store.parentMessage} />}
            <Textarea
              ref={refTextArea}
              rows={rows}
              value={value}
              handleChange={handleTextAreaChange}
              handleImagePaste={handleImagePaste}
              onClick={(e: MouseEvent) => {
                const target = e.target as HTMLTextAreaElement;
                setCaretPos(target.selectionStart as number);
              }}
              setFocused={setFocused}
            />
            <InputFile
              roomId={store.roomId as string}
              setFilesToSend={setFilesToSend}
              setFilesToRemove={setFilesToRemove}
              setIsPopupFileOpen={setIsPopupAttachFileOpen}
              isPopupFileOpen={isPopupAttachFileOpen}
            >
              {isPopupAttachFileOpen && (
                <div className={styles.container} style={{ width: "100%", marginLeft: "0" }}>
                  <EmojiIcon onClick={emojiToggle} />
                  <Textarea
                    ref={refTextArea}
                    rows={rows}
                    value={value}
                    handleChange={handleTextAreaChange}
                    onClick={(e: MouseEvent) => {
                      const target = e.target as HTMLTextAreaElement;
                      setCaretPos(target.selectionStart as number);
                    }}
                    setFocused={setFocused}
                  />
                  {isSendingFiles && <HourGlassLoader />}
                  {!isSendingFiles && (
                    <ButtonSend
                      right={5}
                      bottom={4}
                      onClick={() => sendMessageFromInputFile(filesToSend as FileList)}
                    />
                  )}
                </div>
              )}
            </InputFile>
          </div>

          <ButtonSend onClick={sendMessage} right={15} bottom={3} />
        </div>

        <EmojiPicker
          onEmojiClick={(emojiData) => {
            onEmojiClick(emojiData.emoji);
          }}
          key={caretPos}
          autoFocusSearch={false}
          open={isEmojiOpen}
          className={styles.emoji}
          style={{
            position: "absolute",
            transition: " all 0s linear",
            width: matchesMobile ? "100%" : "350px",
            height: matchesMobile ? "400px" : "450px",
          }}
          lazyLoadEmojis={true}
          emojiStyle={EmojiStyle.NATIVE}
        />
        {isPopupFileOpen && (
          <OverLay closePopup={closePopupFile}>
            <div className={styles.popupWrapper}>
              <PopupImage image={imageSrc} />
              <div className={styles.container} style={{ width: "100%", marginLeft: "0" }}>
                <EmojiIcon onClick={emojiToggle} />
                <Textarea
                  ref={refTextArea}
                  rows={rows}
                  value={value}
                  handleChange={handleTextAreaChange}
                  onClick={(e: MouseEvent) => {
                    const target = e.target as HTMLTextAreaElement;
                    setCaretPos(target.selectionStart as number);
                  }}
                  setFocused={setFocused}
                />
                {isSendingFiles && <HourGlassLoader />}
                {!isSendingFiles && <ButtonSend right={5} bottom={4} onClick={sendFileFromClipboard} />}
              </div>
            </div>
          </OverLay>
        )}
        {isPopupEditMessage && (
          <OverLay closePopup={closePopupEditMessage}>
            <div className={styles.popupWrapper} style={{ width: matchesMobile ? "90vw" : "45vw" }}>
              <div className={styles.container} style={{ width: "100%", marginLeft: "0" }}>
                <EmojiIcon onClick={emojiToggle} />
                <Textarea
                  ref={refTextArea}
                  rows={10}
                  value={value}
                  handleChange={handleTextAreaChange}
                  onClick={(e: MouseEvent) => {
                    const target = e.target as HTMLTextAreaElement;
                    setCaretPos(target.selectionStart as number);
                  }}
                  setFocused={setFocused}
                />
                <ButtonSend right={15} bottom={5} onClick={editMessage} />
              </div>
            </div>
          </OverLay>
        )}
        {store.chatingWith && (
          <PopupFoward
            currentContactId={store.chatingWith.id as string}
            isPopupForwardOpen={isPopupForwardOpen}
            messageToForward={store.messageToForward}
            contactToForward={store.contactToForward}
            closeForwardContactPopup={closeForwardContactPopup}
          />
        )}
        {imageToShow && (
          <OverLay closePopup={() => setImageToShow("")}>
            <img src={imageToShow} alt='' className={styles.popupImage} />
          </OverLay>
        )}
        {videoToShow && (
          <OverLay closePopup={() => setVideoToShow("")}>
            <video src={videoToShow} className={styles.popupImage} controls muted></video>
          </OverLay>
        )}
        {isPopupSearchMessageOpen && (
          <PopupSearchMessage
            isPopupSearchMessageOpen={isPopupSearchMessageOpen}
            scrollIntoView={scrollMessageIntoView}
          />
        )}
      </div>
    );
  },
);

export default Chart;
