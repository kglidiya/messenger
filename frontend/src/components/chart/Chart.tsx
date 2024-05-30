import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useRef, useState } from "react";

import { useSwipeable } from "react-swipeable";

import styles from "./Chart.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import { useIsFirstRender } from "../../hooks/useIsFirstRender";
import useMediaQuery from "../../hooks/useMediaQuery";
import ButtonScrollToBottom from "../../ui/button-scroll-to-bottom/ButtonScrollToBottom";
import ButtonSend from "../../ui/button-send/ButtonSend";
import DetailsButton from "../../ui/details-button/DetaillsButton";
import Globe from "../../ui/globe/Globe";
import EmojiIcon from "../../ui/icons/emoji/EmojiIcon";
import NavBackIcon from "../../ui/icons/nav-back-icon/NavBackIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import InputFile from "../../ui/input-file/InputFile";
import Loader from "../../ui/loader/Loader";
import Textarea from "../../ui/textarea/Textarea";
import { getMessageIndex, getOneUser, getPrevMessage, sendFile } from "../../utils/api";
import { countLines, creactFileToSend, findItemById, getDate } from "../../utils/helpers";
import { IContact, IGroupParticipant, IMessage, IMessageStatus } from "../../utils/types";
import Message from "../message/Message";
import OverLay from "../overlay/Overlay";
import ContactDetails from "../popup-contact-details/ContactDetails";
import PopupFoward from "../popup-foward/PopupFoward";
import PopupGroupDetails from "../popup-group-details/PopupGroupDetails";
import PopupImage from "../popup-image/PopupImage";
import PopupSearchMessage from "../popup-search-message/PopupSearchMessage";
import ReplyToElement from "../replyToElement/ReplyToElement";
import TypingIndicator from "../typing-indicator/TypingIndicator";

const { v4: uuidv4 } = require("uuid");

const Chart = observer(
  ({
    setIsLoading,
    isLoadingMessages,
    isContactsVisible,
    setIsContactsVisible,
  }: {
    setIsLoading: any;
    isLoadingMessages: boolean;
    isContactsVisible: boolean;
    setIsContactsVisible: any;
  }) => {
    // const socket = io("http://localhost:3001", { transports: ["websocket", "polling", "flashsocket"] });
    // const socket = io("http://localhost:3001", { transports: ["websocket", "polling", "flashsocket"] });
    const store = useContext(Context).user;
    const socket = useContext(SocketContext);
    // const [socket, setSocket] = useState<Socket<any> | null>(store.socket);
    const [roomId, setRoomId] = useState<string>("");
    // const [roomData, setRoomData] = useState<any>(null); //ANY
    const [messageIndexToSearch, setMessagesIndexToSearch] = useState<any>(null);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    // const [addedToGroupOn, setAddedToGroupOn] = useState(0);
    const [value, setValue] = useState("");
    // const [isLoading, setIsLoading] = useState(true);
    const [caretPos, setCaretPos] = useState(0);
    const [rows, setRows] = useState(2);
    const [imageSrc, setImageSrc] = useState("");
    const [imageToShow, setImageToShow] = useState("");
    const [videoToShow, setVideoToShow] = useState("");
    const [isPopupFileOpen, setIsPopupFileOpen] = useState(false);
    const [messageClicked, setMessageClicked] = useState("");
    const [isPopupAttachFileOpen, setIsPopupAttachFileOpen] = useState(false);
    const [filesToSend, setFilesToSend] = useState<any>([]);
    const [filesToRemove, setFilesToRemove] = useState<any>([]);
    const [isPopupReactionOpen, setIsPopupReactionOpen] = useState(false);
    const [isPopupMessageActionsOpen, setIsPopupMessageActionsOpen] = useState(false);
    const [isPopupEmojiReactionsOpen, setIsPopupEmojiReactionsOpen] = useState(false);
    const [isPopupDetailsOpen, setIsPopupDetailsOpen] = useState(false);
    const [isPopupForwardContact, setIsPopupForwardContact] = useState(false);
    const [isPopupSearchMessageOpen, setIsPopupSearchMessageOpen] = useState(false);
    const [isPopupEditMessage, setIsPopupEditMessage] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUserData, setTypingUserData] = useState<any | null>(null);
    const [newMessagesNotification, setNewMessagesNotification] = useState(false);
    const [limit, setLimit] = useState<any>(15);
    const [offsetNext, setOffsetNext] = useState<number>(0);
    const [offsetPrev, setOffsetPrev] = useState<number>(0);
    const [fetching, setFetching] = useState(false);
    const [fetchNext, setFetchNext] = useState(false);
    const [fetchPrev, setFetchPrev] = useState(true);
    const refAnchor = useRef<HTMLDivElement>(null);
    const refChart = useRef<HTMLDivElement | null>(null);
    const refMessages = useRef<HTMLDivElement | null>(null);
    const refTextArea = React.useRef<HTMLTextAreaElement>(null);
    const itemsRef = useRef<any[]>([]);
    const [scroll, setScroll] = useState<number | undefined>();
    const [focused, setFocused] = React.useState(false);
    const matchesMobile = useMediaQuery("(max-width: 576px)");
    const isFirstRender = useIsFirstRender();
    const resetFetchParams = () => {
      setFetching(true);
      setFetchPrev(true);
      setOffsetPrev(0);
      setOffsetNext(0);
      setLimit(15);
    };

    useEffect(() => {
      itemsRef.current = itemsRef.current.slice(0, store.prevMessages.length);
    }, [store.prevMessages.length]);

    const scrollToBottom = () => {
      // if (itemsRef.current && store.prevMessages.length) {
      //   itemsRef.current[store.prevMessages.length - 1].scrollIntoView({
      //     behavior: "smooth",
      //   });
      // }
      // console.log("scrollToBottom");
      // console.log("offsetNext", offsetNext);
      // console.log("offsetPrev", offsetPrev);
      if (itemsRef.current && store.prevMessages.length) {
        const lastMessage = store.prevMessages[store.prevMessages.length - 1].id;
        if (store.currentRoom.lastMessageId === lastMessage) {
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
    // console.log(store.chat.length);
    // console.log("fetching", fetching);

    const scrollIntoView = async (messageId: string) => {
      // console.log(parent);
      // const targetMessage = store.prevMessages.indexOf(messageClicked);
      // const targetMessage = findIndex(store.prevMessages, { id: parent });
      const targetMessage = store.prevMessages.findIndex((el: any) => el.id === messageId);
      // console.log(targetMessage);
      if (itemsRef.current && targetMessage !== -1) {
        itemsRef.current[targetMessage].scrollIntoView({ behavior: "smooth" });
      } else {
        const index = await getMessageIndex({ id: messageId, roomId: store.roomId });
        // console.log("index", index);
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
      // console.log(targetMessage);
    };

    useEffect(() => {
      if (store.isAuth) {
        // setIsLoading(false);

        store.setContacts();
        const data = {
          userId: store.user.id,
          isOnline: true,
        };

        socket && socket.emit("update-userData", data);
      }
    }, [store.isAuth]);

    useEffect(() => {
      if (store.contacts.length) {
        // store.setChatingWith(store.contacts[0]);
        // console.log("isFirstRender", isFirstRender);
        // console.log("store.contacts.length", store.contacts.length);
        if (store.chatingWith) {
          store.setChatingWith(store.contacts[store.contacts.length - 1]);
        } else store.setChatingWith(store.contacts[0]);
      }
    }, [store.contacts.length]);

    // console.log(toJS(store.chatingWith));
    useEffect(() => {
      // console.log(toJS(store.chatingWith));
      if (store.chatingWith) {
        // console.log("store.setCurrentRoom");
        setValue("");
        store.setCurrentRoom(store.chatingWith.chatId);
        refTextArea.current?.focus();
      }
    }, [store.chatingWith]);

    useEffect(() => {
      if (store.currentRoom) {
        setIsLoading(true);
        store.setRoomId(store.currentRoom?.id);
      }
    }, [store.currentRoom]);
    // console.log("store.currentRoom", toJS(store.currentRoom));
    // console.log("store.chatingWith", toJS(store.chatingWith));
    // console.log(addedToGroupOn);
    useEffect(() => {
      if (store.roomId) {
        // setIsLoading(false);
        // console.log("fetch", store.roomId);
        // store.getOneRoom({ roomId: store.currentRoom?.id });
        // store.setContacts();
        // store.setCurrentRoom(store.chatingWith.id);
        // console.log("currentRoom.firstUnreadMessage", toJS(store.currentRoom));
        if (store.currentRoom && store.currentRoom.firstUnreadMessage) {
          // console.log("fetch unread");
          scrollIntoView(store.currentRoom.firstUnreadMessage);
          setNewMessagesNotification(true);
        } else {
          // console.log("fetch allread");
          resetFetchParams();
        }

        socket && socket.emit("meeting", { roomId: store.roomId });
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
      socket.on("meeting", (data: IMessage) => {
        // scrollToBottom();
        // console.log(data);
        // store.setContacts();
      });

      socket.on("receive-message", (message: IMessage) => {
        console.log("receive-message");
        // console.log(`store.roomId  ${store.roomId}`);
        // console.log(`message ${message.roomId}`);
        // console.log(typeof store.roomId);
        // console.log(typeof message.roomId);
        // console.log("message.roomId", message.roomId);
        // console.log(`store.roomId  ${store.roomId}`);
        if (message.roomId === store.roomId) {
          if (store.prevMessages.length) {
            const lastMessage = store.prevMessages[store.prevMessages.length - 1].id;
            if (store.currentRoom.lastMessageId !== lastMessage) {
              store.clearMessages();
              resetFetchParams();
            } else {
              store.addMessage(message);
              setOffsetPrev((prev: any) => prev + 1);
            }
          } else {
            store.addMessage(message);
            setOffsetPrev((prev: any) => prev + 1);
          }

          store.updateCurrentRoomLastMsgId(message.id);
          setTimeout(() => {
            scrollToBottom();
          }, 20);
        }
        store.incrementUnreadCount(message);
        // scrollToBottom();
        // if (message.roomId === store.roomId) {
        //   store.incrementRoomUndeadIndex(message.roomId);
        // }
      });

      socket.on("forward-message", (message: IMessage) => {
        console.log("forward-message");
        // console.log(`store.roomId  ${store.roomId}`);
        // console.log(`message ${message.roomId}`);
        // console.log(typeof store.roomId);
        // console.log(typeof message.roomId);
        // console.log("message.roomId", message.roomId);
        // console.log(`store.roomId  ${store.roomId}`);
        if (message.roomId === store.roomId) {
          if (message.currentUserId !== store.user.id) {
            if (store.prevMessages.length) {
              const lastMessage = store.prevMessages[store.prevMessages.length - 1].id;
              if (store.currentRoom.lastMessageId !== lastMessage) {
                store.clearMessages();
                resetFetchParams();
              } else {
                store.addMessage(message);
                setOffsetPrev((prev: any) => prev + 1);
              }
            } else {
              store.addMessage(message);
              setOffsetPrev((prev: any) => prev + 1);
            }
          }
          store.updateCurrentRoomLastMsgId(message.id);
          setTimeout(() => {
            scrollToBottom();
          }, 20);
          // store.updateUnreadCount(message);
          // scrollToBottom();
        }
        // scrollToBottom();
        store.incrementUnreadCount(message);
        // if (message.roomId === store.roomId) {
        //   store.incrementRoomUndeadIndex(message.roomId);
        // }
      });

      socket.on("receive-file", (message: IMessage) => {
        // console.log(`store.roomId  ${store.roomId}`);
        // console.log(`message ${message}`);
        // console.log(typeof store.roomId);
        // console.log("filesCounter", store.filesCounter);
        if (message.roomId === store.roomId) {
          if (store.prevMessages.length) {
            const lastMessage = store.prevMessages[store.prevMessages.length - 1].id;
            if (store.currentRoom.lastMessageId !== lastMessage && store.filesCounter === 1) {
              store.clearMessages();
              resetFetchParams();
            } else {
              store.addMessage(message);
              setOffsetPrev((prev: any) => prev + 1);
              setTimeout(() => {
                scrollToBottom();
              }, 20);
            }
          } else {
            store.addMessage(message);
            setOffsetPrev((prev: any) => prev + 1);
            setTimeout(() => {
              scrollToBottom();
            }, 20);
          }

          store.updateCurrentRoomLastMsgId(message.id);
        }
        store.incrementUnreadCount(message);
        // if (message.roomId === store.roomId) {
        //   store.incrementRoomUndeadIndex(message.roomId);
        // }
      });

      socket.on("receive-reaction", (message: IMessage) => {
        console.log("receive-reaction");
        if (message.roomId === store.roomId) {
          store.updateMessage(message);
        }
      });

      socket.on("receive-message-status", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          store.updateMessage(message);
        }

        store.decrementUnreadCount(message);
      });

      socket.on("receive-updatedMessage", (message: IMessage) => {
        console.log("receive-updatedMessage", message);
        if (message.roomId === store.roomId) {
          store.updateMessage(message);
        }
      });

      socket.on("receive-message-deleted", (message: IMessage) => {
        if (message.roomId === store.roomId) {
          store.updateMessage(message);
        }
      });
      socket.on("receive-typingState", (typingState: any) => {
        if (store.roomId === typingState.roomId && typingState.userId !== store.user.id) {
          setTypingUserData(typingState);
        } else setTypingUserData(null);
        // setTypingUserData(typingState);
      });

      socket.on("receive-userData", (user: any) => {
        // console.log(user);
        if (
          store.isAuth &&
          (findIndex(store.contacts, {
            id: user.id,
          }) !== -1 ||
            user.id === store.user.id)
        ) {
          store.updateUserData(user);
        }
        // else {
        //   store.setContacts();
        //   //store.setChatingWith(user);
        // }
        //store.updateUserData(user);unreadnone
        //store.setContacts();
        // store.setChatingWith(user);
      });

      socket.on("receive-newChatData", (res: any) => {
        if (res.includes(store.user.id)) {
          console.log("receive-newChatData", res);
          store.setContacts();
          // store.setUnreadCount();
          store.clearMessages();
          // console.log("store.contacts.length;", toJS(store.contacts.length));
        }

        // setTimeout(() => {
        //   // chatWithLastContact();
        //   console.log("store.contacts.length;", toJS(store.contacts.length));
        // }, 0);
      });

      socket.on("receive-groupData", (groupData: any) => {
        // console.log("receive-groupData", groupData);
        const participant = groupData.participants.filter((el: IGroupParticipant) => el.userId === store.user.id)[0];
        // console.log("participant", participant);
        const isGroupInContacts = store.contacts.findIndex((el: any) => el.chatId === groupData.id) !== -1;
        if (participant && !participant.isDeleted && isGroupInContacts) {
          // console.log("1");
          store.updateGroup(groupData);
        }
        if (participant && !participant.isDeleted && !isGroupInContacts) {
          // console.log("2");
          store.setContacts();
        }
        if (participant && participant.isDeleted && isGroupInContacts) {
          // console.log("3");
          store.setContacts();
          store.setChatingWith(null);
          store.setCurrentRoom(null);
          store.clearMessages();
        }
      });
    }, []);

    // console.log(socket);
    // console.log("roomDataddddd", roomData && roomData.lastMessageId);
    const sendMessage = () => {
      // e.preventDefault();
      // moment.locale();
      // console.log(value);
      if (value) {
        const message = {
          id: uuidv4(),
          currentUserId: store.user.id,
          // recipientUserId: store.chatingWith.id,
          recipientUserId: store.chatingWith.email ? store.chatingWith.id : store.roomId,
          message: value,
          // contact:
          // status: IMessageStatus.SENT,
          parentMessage: store.parentMessage,
          roomId: store.roomId,
          readBy: store.user.id,
        };

        socket && socket.emit("send-message", message);
        // store.updateRooms(store.roomId, message.id);

        setTimeout(() => {
          setValue("");
          setRows(2);
          refTextArea.current?.focus();
          // scrollToBottom();
          if (store.parentMessage) {
            store.setParentMessage(null);
          }
        }, 0);
      }
    };
    const editMessage = () => {
      // e.preventDefault();
      // moment.locale();
      // console.log("messageToEdit", toJS(store.messageToEdit));
      // console.log(value);
      if (value) {
        const message = {
          ...store.messageToEdit,
          message: value,
        };
        // console.log("edit-message", message);
        socket && socket.emit("edit-message", message);
        // store.updateRooms(store.roomId, message.id);

        setTimeout(() => {
          setValue("");
          setRows(2);
          // refTextArea.current?.focus();
          store.clearMessageToEdit();
          closePopupEditMessage();
        }, 0);
      }
    };
    // console.log("messageToEdit", toJS(store.messageToEdit));
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
      setIsPopupForwardContact(true);
      closeMessageActionsPopup();
      closeDetailsPopup();
    };
    const closeForwardContactPopup = () => {
      setIsPopupForwardContact(false);
    };

    const closeSearchMessagePopup = () => {
      setIsPopupSearchMessageOpen(false);
    };
    const openSearchMessagePopup = () => {
      setIsPopupSearchMessageOpen(true);
    };

    const openPopupEditMessage = () => {
      setIsPopupEditMessage(true);
    };
    const closePopupEditMessage = () => {
      setIsPopupEditMessage(false);
    };

    const handleChange = (e: any) => {
      setCaretPos(e.target.selectionStart);
      setValue(e.target.value);
      const newLines = countLines(e.target);
      if (!newLines) setRows(2);
      if (newLines < 10) setRows(newLines + 1);
      else setRows(10);
    };

    useEffect(() => {
      if (value && focused) {
        setIsTyping(true);
      } else setIsTyping(false);
    }, [value, focused]);
    // console.log("focused", focused);
    useEffect(() => {
      socket.emit("update-typingState", { roomId: store.roomId, userId: store.user.id, isTyping: isTyping });
    }, [isTyping]);

    // console.log("isTyping", isTyping);

    const onEmojiClick = (emoji: any) => {
      setValue(value.slice(0, caretPos) + emoji + value.slice(caretPos));
    };

    const emojiToggle = () => {
      setIsEmojiOpen(!isEmojiOpen);
    };

    const closeAllPopups = (e: any) => {
      if (e.target.nodeName === "DIV") {
        setIsEmojiOpen(false);
        closeReactionPopup();
        closeMessageActionsPopup();
        store.setMessageToForward(null);
        store.setContactToForward(null);
        store.clearSelectedUsers();
        // store.setCurrentRoom(null);
        closeEmojiReactionsPopup();
        closeDetailsPopup();
        closeForwardContactPopup();
        closeSearchMessagePopup();
      }
    };

    const closePopupFile = () => {
      setIsPopupFileOpen(false);
    };

    const sendMessageFile = async (files: FileList) => {
      // console.log("sendMessageFile");
      // e.preventDefault();
      for (let index = 0; index < files.length; index++) {
        const form = new FormData();
        // console.log(files[index]);
        // console.log(value);
        if (!(filesToRemove.indexOf(files[index].name) !== -1) || filesToRemove.length === 0) {
          form.append("file", files[index]);
          const data = {
            currentUserId: store.user.id,
            // recipientUserId: store.chatingWith.id,
            recipientUserId: store.chatingWith.email ? store.chatingWith.id : store.roomId,
            message: index === 0 && value ? value : "",
            parentMessage: store.parentMessage,
            roomId: store.roomId,
            readBy: store.user.id,
            // form,
          };
          for (let key in data) {
            // console.log(data[key as keyof typeof data]);
            form.append(key, data[key as keyof typeof data]);
            // setFilesCounter((prev) => prev++);
          }
          // form.append(data);
          const message = await sendFile(form);
          // console.log("index", index);
          // store.setFilesCounter(index);
          // setFilesCounter(files.length);
          // store.updateRooms(store.roomId, message.id);
          setTimeout(() => {
            socket.emit("send-file", message);
            store.incrementFilesCounter();
            // setFilesCounter((prev) => prev + 1);
            setValue("");
            setRows(2);
            // refTextArea.current?.focus();
            // setFilesCounter(0);
          }, 0);
        }
      }
      setIsPopupAttachFileOpen(false);
      setFilesToRemove([]);
      store.setFilesCounter(0);
      //setFilesCounter(0);
    };
    const [fileFromClipboard, setFileFromClipboard] = useState<any>(null);
    const handleImagePaste = async (event: any) => {
      try {
        if (!navigator.clipboard) {
          console.error("Копирование и вставка не работает в данном браузере");
          return;
        }

        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
          const imageTypes = clipboardItem.types.find((type) => type.startsWith("image/"));
          // console.log("clipboardItem", clipboardItem);
          if (imageTypes) {
            const blob = await clipboardItem.getType(imageTypes);
            // console.log(blob);
            // console.log(`imageTypes ${imageTypes}`);
            // creactFileToSend(blob, "image/png");
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
      // e.preventDefault();
      const file = creactFileToSend(fileFromClipboard, "image/png");
      const form = new FormData();
      form.append("file", file);
      const data = {
        currentUserId: store.user.id,
        // recipientUserId: store.chatingWith.id,
        recipientUserId: store.chatingWith.email ? store.chatingWith.id : store.roomId,
        message: value ? value : "",
        parentMessage: store.parentMessage,
        roomId: store.roomId,
        readBy: store.user.id,
        form,
      };
      for (let key in data) {
        // console.log(data[key as keyof typeof data]);
        form.append(key, data[key as keyof typeof data]);
      }
      // const message = await sendFile(form, data);
      const message = await sendFile(form);
      setTimeout(() => {
        socket.emit("send-file", message);
        // store.updateRooms(store.roomId, message.id);
        setValue("");
        setRows(2);
        setIsPopupFileOpen(false);
        setFileFromClipboard(null);
        // refTextArea.current?.focus();
      }, 0);
    };

    // console.log("roomDataddddd", roomData && roomData.lastMessageId);
    // const scrollHander = (e: WheelEvent) => {
    //   refMessages.current && setScroll(refMessages.current?.scrollHeight - refMessages.current?.scrollTop);

    //   const chartHeight = refMessages.current?.scrollHeight;
    //   const chartBottomPos =
    //     refMessages.current &&
    //     refChart.current &&
    //     refMessages.current?.scrollTop + refChart.current?.scrollHeight - 150;
    //   if (e.deltaY < 0 || e.deltaY > 0) {
    //     setNewMessagesNotification(false);
    //   }

    //   if (
    //     store.prevMessages.length &&
    //     refMessages.current &&
    //     refMessages.current?.scrollTop < 100 &&
    //     e.deltaY < 0 &&
    //     store.prevMessages[0].id !== store.currentRoom.firstMessageId
    //   ) {
    //     // console.log("set prev");
    //     setFetchPrev(true);
    //     setFetchNext(false);
    //     setFetching(true);
    //   }

    //   if (
    //     store.prevMessages.length &&
    //     e.deltaY > 0 &&
    //     store.prevMessages[store.prevMessages.length - 1].id !== store.currentRoom.lastMessageId &&
    //     chartBottomPos &&
    //     chartHeight &&
    //     chartBottomPos - chartHeight > 0
    //   ) {
    //     // console.log("fetch next");

    //     setFetchNext(true);
    //     setFetchPrev(false);
    //     setFetching(true);

    //   }
    //   // console.log("fetchNext", fetchNext);
    //   // console.log("fetchPrev", fetchPrev);
    // };
    // console.log(toJS(roomData));
    // console.log("fetching", fetching);
    const scrollHander = (e: WheelEvent) => {
      // console.log("e.deltaY ", e.deltaY);
      refMessages.current && setScroll(refMessages.current?.scrollHeight - refMessages.current?.scrollTop);

      const chartHeight = refMessages.current?.scrollHeight;
      const chartBottomPos =
        refMessages.current &&
        refChart.current &&
        refMessages.current?.scrollTop + refChart.current?.scrollHeight - 150;
      if (e.deltaY < 0 || e.deltaY > 0) {
        setNewMessagesNotification(false);
      }
      // console.log("chartHeight ", chartHeight);
      // console.log("chartBottomPos ", chartBottomPos);
      // console.log("refMessages.current?.scrollTop < 100", refMessages.current && refMessages.current?.scrollTop < 100);
      // console.log(
      //   "store.prevMessages[0].id !== store.currentRoom.firstMessageId",
      //   store.prevMessages[0].id !== store.currentRoom.firstMessageId,
      // );
      // console.log("e.deltaY < 0", e.deltaY < 0);
      if (
        store.prevMessages.length &&
        refMessages.current &&
        refMessages.current?.scrollTop < 100 &&
        store.prevMessages[0].id !== store.currentRoom.firstMessageId
      ) {
        if ((matchesMobile && e.deltaY > 0) || (!matchesMobile && e.deltaY < 0)) {
          console.log("set prev");
          setFetchPrev(true);
          setFetchNext(false);
          setFetching(true);
        }
      }

      if (
        store.prevMessages.length &&
        store.prevMessages[store.prevMessages.length - 1].id !== store.currentRoom.lastMessageId &&
        chartBottomPos &&
        chartHeight &&
        chartBottomPos - chartHeight > 0
      ) {
        if ((matchesMobile && e.deltaY < 0) || (!matchesMobile && e.deltaY > 0)) {
          console.log("fetch next");

          setFetchNext(true);
          setFetchPrev(false);
          setFetching(true);
        }
      }
      // console.log("fetchNext", fetchNext);
      // console.log("fetchPrev", fetchPrev);
    };

    useEffect(() => {
      const chart = refMessages.current;

      chart && chart.addEventListener("wheel", scrollHander);

      return function () {
        chart && chart.removeEventListener("wheel", scrollHander);
      };
    }, [store.currentRoom]);

    const handlers = useSwipeable({
      onSwipedDown: (e: any) => {
        scrollHander(e);
      },
      onSwipedUp: (e: any) => {
        scrollHander(e);
      },
    });

    const fetchMessages = async () => {
      // console.log("fetchNext", fetchNext);
      // console.log("fetchPrev", fetchPrev);
      // console.log("offsetNext", offsetNext);
      // console.log("offsetPrev", offsetPrev);
      // console.log(" limit", limit);
      // console.log("store.prevMessages", toJS(store.prevMessages));

      try {
        // console.log("setNext", offsetNext);
        // console.log("offsetPrev", offsetPrev);
        // console.log("limit", limit);
        const res = await getPrevMessage({
          limit,
          offset: fetchNext ? offsetNext : offsetPrev,
          roomId: store.roomId,
        });
        const messages = res.reverse();
        if (fetchPrev) {
          store.setMessages([...messages, ...store.prevMessages]);
          setIsLoading(false);
        }
        if (fetchNext) {
          store.setMessages([...store.prevMessages, ...messages]);
        }
        setTimeout(() => {
          setFetching(false);
          setFetchNext(false);
          setFetchPrev(false);
        }, 0);
      } catch (e: any) {
        console.log(e);
      }
    };

    useEffect(() => {
      if (fetching) {
        if (fetchPrev) {
          if (isFirstRender) {
            setOffsetPrev(limit);
          } else
            setOffsetPrev((prev: any) => {
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
          // console.log("fetchNext", fetchNext);
          if (offsetNext === 0) {
            setLimit(15);
          }
          if (offsetNext > 0 && offsetNext < 15) {
            // console.log("offsetNext > 0 && offsetNext < 15");
            setLimit(offsetNext);
            setOffsetNext(0);
          }
          if (offsetNext >= 15) {
            // console.log("offsetNext >= 15");
            setLimit(15);
            setOffsetNext(offsetNext - 15);
          }
        }
        setTimeout(() => {
          fetchMessages();
        }, 0);
        // fetchMessages();
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
          // refTextArea.current?.focus();
        }
        if (isPopupAttachFileOpen && e.key === "Enter" && e.ctrlKey) {
          sendMessageFile(filesToSend);
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

    const refPassthrough = (el: any) => {
      handlers.ref(el);
      refMessages.current = el;
    };
    return (
      <div
        className={styles.wrapper}
        onClick={closeAllPopups}
        // {...handlers}
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
        {!store.currentRoom || (!store.chatingWith && <div className={styles.contactNone} />)}
        <div
          className={styles.content}
          style={{
            height: `calc(100% - 200px - ${rows * 18}px)`,
            marginTop: store.contacts.length === 0 ? "80px" : "0",
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
            store.prevMessages.map((message: any, i: number, arr: any) => {
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
                    // socket={socket}
                    roomId={store.roomId}
                    ref={(el) => (itemsRef.current[i] = el)}
                    scrollIntoView={scrollIntoView}
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

        {/* {store.parentMessage && <ReplyToElement {...store.parentMessage} />} */}
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
            {/* {store.chatingWith && !store.chatingWith.groupId && (
            <TypingIndicator
              avatar={store.chatingWith.avatar}
              email={store.chatingWith.email}
              userName={store.chatingWith.userName}
            />
          )} */}
            {store.chatingWith &&
              !store.chatingWith.email &&
              typingUserData &&
              typingUserData.isTyping &&
              store.currentRoom.participants.map((user: any) => {
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
            {/* {store.parentMessage && <ReplyToElement {...store.parentMessage} />} */}
            {store.parentMessage && <ReplyToElement {...store.parentMessage} />}
            <Textarea
              ref={refTextArea}
              rows={rows}
              value={value}
              handleChange={handleChange}
              handleImagePaste={handleImagePaste}
              onClick={(e: any) => setCaretPos(e.target.selectionStart)}
              setFocused={setFocused}
            />
            <InputFile
              roomId={store.roomId}
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
                    handleChange={handleChange}
                    onClick={(e: any) => setCaretPos(e.target.selectionStart)}
                    setFocused={setFocused}
                  />
                  <ButtonSend right={5} bottom={4} onClick={() => sendMessageFile(filesToSend)} />
                </div>
              )}
            </InputFile>
          </div>
          <ButtonSend onClick={sendMessage} right={15} bottom={3} />
        </div>

        <EmojiPicker
          onEmojiClick={(emojiData) => {
            // console.log(emojiData);
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
              <div
                // onSubmit={(e) => sendFileFromClipboard(e)}
                className={styles.container}
                style={{ width: "100%", marginLeft: "0" }}
              >
                <EmojiIcon onClick={emojiToggle} />
                <Textarea
                  ref={refTextArea}
                  rows={rows}
                  value={value}
                  handleChange={handleChange}
                  // handleImagePaste={handleImagePaste}
                  onClick={(e: any) => setCaretPos(e.target.selectionStart)}
                  setFocused={setFocused}
                />
                <ButtonSend right={5} bottom={4} onClick={sendFileFromClipboard} />
              </div>
            </div>
          </OverLay>
        )}
        {isPopupEditMessage && (
          <OverLay closePopup={closePopupEditMessage}>
            <div className={styles.popupWrapper} style={{ width: matchesMobile ? "90vw" : "45vw" }}>
              <div
                // onSubmit={(e) => sendFileFromClipboard(e)}
                className={styles.container}
                style={{ width: "100%", marginLeft: "0" }}
              >
                <EmojiIcon onClick={emojiToggle} />
                <Textarea
                  ref={refTextArea}
                  rows={10}
                  value={value}
                  handleChange={handleChange}
                  // handleImagePaste={handleImagePaste}
                  onClick={(e: any) => setCaretPos(e.target.selectionStart)}
                  setFocused={setFocused}
                />
                <ButtonSend right={15} bottom={5} onClick={editMessage} />
              </div>
            </div>
          </OverLay>
        )}
        {store.chatingWith && (
          <PopupFoward
            currentContactId={store.chatingWith.id}
            isPopupForwardContact={isPopupForwardContact}
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
          <PopupSearchMessage isPopupSearchMessageOpen={isPopupSearchMessageOpen} scrollIntoView={scrollIntoView} />
        )}
      </div>
    );
  },
);

export default Chart;
