import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { findIndex } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import * as moment from "moment";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { Socket, io } from "socket.io-client";

import styles from "./Chart.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
import { useIsFirstRender } from "../../hooks/useIsFirstRender";
import ButtonNav from "../../ui/button-scroll-to-bottom/ButtonScrollToBottom";
import ButtonScrollToBottom from "../../ui/button-scroll-to-bottom/ButtonScrollToBottom";
import ButtonSend from "../../ui/button-send/ButtonSend";
import DetailsButton from "../../ui/details-button/DetaillsButton";
import Globe from "../../ui/globe/Globe";
import EmojiIcon from "../../ui/icons/emoji/EmojiIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import SearchIcon from "../../ui/icons/search-icon/SearchIcon";
import InputFile from "../../ui/input-file/InputFile";
import Loader from "../../ui/loader/Loader";
import Textarea from "../../ui/textarea/Textarea";
import { getMessageIndex, getOneUser, getPrevMessage, sendFile } from "../../utils/api";
import { countLines, findItemById, getDate } from "../../utils/helpers";
import { users, messages } from "../../utils/mockData";
import { IContact, IGroupParticipant, IMessage, IMessageStatus } from "../../utils/types";
import Message from "../message/Message";
import OverLay from "../overlay/Overlay";
import PdfLoader from "../pdf-loader/PdfLoader";
import ContactDetails from "../popup-contact-details/ContactDetails";
import PopupFoward from "../popup-foward/PopupFoward";
import PopupGroupDetails from "../popup-group-details/PopupGroupDetails";
import PopupImage from "../popup-image/PopupImage";
import PopupSearchMessage from "../popup-search-message/PopupSearchMessage";
import ReplyToElement from "../replyToElement/ReplyToElement";
import TypingIndicator from "../typing-indicator/TypingIndicator";

const { v4: uuidv4 } = require("uuid");

const Chart = observer(({ setIsLoading, isLoading }: { setIsLoading: any; isLoading: boolean }) => {
  // const socket = io("http://localhost:3001", { transports: ["websocket", "polling", "flashsocket"] });
  const userStore = useContext(Context).user;
  const socket = useContext(SocketContext);
  // const [socket, setSocket] = useState<Socket<any> | null>(userStore.socket);
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
  const [isPopupReactionOpen, setIsPopupReactionOpen] = useState(false);
  const [isPopupMessageActionsOpen, setIsPopupMessageActionsOpen] = useState(false);
  const [isPopupEmojiReactionsOpen, setIsPopupEmojiReactionsOpen] = useState(false);
  const [isPopupDetailsOpen, setIsPopupDetailsOpen] = useState(false);
  const [isPopupForwardContact, setIsPopupForwardContact] = useState(false);
  const [isPopupSearchMessageOpen, setIsPopupSearchMessageOpen] = useState(false);
  const [isReplyToMessageOpen, setIsReplyToMessageOpen] = useState(true);
  const [typingUserData, setTypingUserData] = useState<any | null>(null);
  // const [filesCounter, setFilesCounter] = useState(0);
  const [limit, setLimit] = useState<any>(15);
  const [offsetNext, setOffsetNext] = useState<number>(0);
  const [offsetPrev, setOffsetPrev] = useState<number>(0);
  const [fetching, setFetching] = useState(false);
  const [fetchNext, setFetchNext] = useState(false);
  const [fetchPrev, setFetchPrev] = useState(true);
  const refAnchor = useRef<HTMLDivElement>(null);
  const refChart = useRef<HTMLDivElement>(null);
  const refMessages = useRef<HTMLDivElement>(null);
  const refTextArea = React.useRef<HTMLTextAreaElement>(null);
  const itemsRef = useRef<any[]>([]);
  const [scroll, setScroll] = useState<number | undefined>();
  const [focused, setFocused] = React.useState(false);
  const isFirstRender = useIsFirstRender();
  const resetFetchParams = () => {
    setFetching(true);
    setFetchPrev(true);
    setOffsetPrev(0);
    setOffsetNext(0);
  };

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, userStore.prevMessages.length);
  }, [userStore.prevMessages.length]);

  const scrollToBottom = () => {
    // if (itemsRef.current && userStore.prevMessages.length) {
    //   itemsRef.current[userStore.prevMessages.length - 1].scrollIntoView({
    //     behavior: "smooth",
    //   });
    // }
    console.log("scrollToBottom");
    // console.log("offsetNext", offsetNext);
    // console.log("offsetPrev", offsetPrev);
    if (itemsRef.current && userStore.prevMessages.length) {
      const lastMessage = userStore.prevMessages[userStore.prevMessages.length - 1].id;
      if (userStore.currentRoom.lastMessageId === lastMessage) {
        itemsRef.current[userStore.prevMessages.length - 1].scrollIntoView({
          behavior: "auto",
        });
      } else {
        userStore.clearMessages();
        resetFetchParams();
      }
    }

    setScroll(document.documentElement.clientHeight);
  };
  // console.log(userStore.chat.length);
  // console.log("fetching", fetching);

  const scrollIntoView = async (parent: string) => {
    // console.log(parent);
    // const targetMessage = userStore.prevMessages.indexOf(messageClicked);
    // const targetMessage = findIndex(userStore.prevMessages, { id: parent });
    const targetMessage = userStore.prevMessages.findIndex((el: any) => el.id === parent);
    // console.log(targetMessage);
    if (itemsRef.current && targetMessage !== -1) {
      itemsRef.current[targetMessage].scrollIntoView({ behavior: "smooth" });
    } else {
      const index = await getMessageIndex({ id: parent, roomId: userStore.roomId });
      console.log("index", index);
      if (index >= 0) {
        userStore.clearMessages();
        // if (Number(index) >= 10) {
        //   setOffsetPrev(index - 4);
        //   setOffsetNext(index - 4 - 5);
        // } else {
        //   setOffsetPrev(index);
        //   setOffsetNext(0);
        // }
        if (Number(index) >= 30) {
          setOffsetPrev(index - (limit - 1));
          setOffsetNext(index - (limit - 1) - limit);
        } else {
          setOffsetPrev(index);
          setOffsetNext(0);
        }

        setFetching(true);
        setFetchPrev(true);
      } else setMessagesIndexToSearch(null);
    }
    // console.log(targetMessage);
  };
  // useEffect(() => {
  //   if (userStore.contacts.length > 0) {
  //     if (userStore.chatingWith) {
  //       setuserStore.chatingWith(findUserById(userStore.contacts, userStore.chatingWith)[0]);
  //     } else setuserStore.chatingWith(findUserById(userStore.contacts, userStore.contacts[0].id)[0]);
  //   }
  // }, [userStore.chatingWith, userStore.contacts.length]);
  useEffect(() => {
    if (userStore.isAuth) {
      setIsLoading(false);
      // console.log(`userStore.isAuth`);
      userStore.setContacts();
      const data = {
        userId: userStore.user.id,
        isOnline: true,
      };
      // console.log(`data,`, data);
      socket && socket.emit("update-userData", data);
    }
  }, [userStore.isAuth]);

  useEffect(() => {
    if (userStore.contacts.length) {
      // userStore.setChatingWith(userStore.contacts[0]);
      // console.log("isFirstRender", isFirstRender);
      // console.log("userStore.contacts.length", userStore.contacts.length);
      if (userStore.chatingWith) {
        userStore.setChatingWith(userStore.contacts[userStore.contacts.length - 1]);
      } else userStore.setChatingWith(userStore.contacts[0]);
    }
  }, [userStore.contacts.length]);

  // console.log(toJS(userStore.chatingWith));
  useEffect(() => {
    // console.log(toJS(userStore.chatingWith));
    if (userStore.chatingWith) {
      // console.log("userStore.setCurrentRoom");
      setValue("");
      userStore.setCurrentRoom(userStore.chatingWith.chatId);
      // if (!userStore.chatingWith.email) {
      //   userStore.setCurrentRoom(userStore.chatingWith.chatId);
      // } else {
      //   // const userIds = [userStore.user.id, userStore.chatingWith.id].sort();
      //   userStore.setCurrentRoom(userStore.chatingWith.chatId);
      // }
    }
    // else if (userStore.chatingWith && !isFirstRender) {
    //   userStore.getOneRoom({ roomId: userStore.currentRoom?.id });
    // }
  }, [userStore.chatingWith]);

  useEffect(() => {
    if (userStore.currentRoom) {
      userStore.setRoomId(userStore.currentRoom?.id);
    }
  }, [userStore.currentRoom]);
  // console.log("userStore.currentRoom", toJS(userStore.currentRoom));
  // console.log("userStore.chatingWith", toJS(userStore.chatingWith));
  // console.log(addedToGroupOn);
  useEffect(() => {
    if (userStore.roomId) {
      // setIsLoading(false);
      // console.log("fetch", userStore.roomId);
      // userStore.getOneRoom({ roomId: userStore.currentRoom?.id });
      // userStore.setContacts();
      // userStore.setCurrentRoom(userStore.chatingWith.id);
      // console.log("currentRoom.firstUnreadMessage", toJS(userStore.currentRoom));
      if (userStore.currentRoom && userStore.currentRoom.firstUnreadMessage) {
        console.log("fetch unread");
        scrollIntoView(userStore.currentRoom.firstUnreadMessage);
      } else {
        console.log("fetch allread");
        setFetching(true);
        setFetchPrev(true);
        setOffsetPrev(0);
        setOffsetNext(0);
        // setTimeout(() => {
        //   scrollToBottom();
        // }, 0);
        // scrollToBottom();
        // setFetching(true);
        // setFetchPrev(true);
        // setOffsetPrev(0);
        // setOffsetNext(0);
      }

      socket && socket.emit("meeting", { roomId: userStore.roomId });
      // scrollToBottom();
      // setTimeout(() => {
      //   scrollToBottom();
      // }, 0);
    }
    // setIsLoading(false);
  }, [userStore.roomId]);

  // useEffect(() => {
  //   if (roomData) {
  //     // setRoomData(userStore.roomAll.filter((room: any) => room.id === userStore.roomId)[0]);
  //     console.log(
  //       "firstUnreadMessage",
  //       userStore.roomAll.filter((room: any) => room.id === userStore.roomId)[0].firstUnreadMessage,
  //       // roomData.firstUnreadMessage,
  //     );
  //     const firstUnreadMessage = roomData.firstUnreadMessage;
  //     if (firstUnreadMessage) {
  //       scrollIntoView(firstUnreadMessage);
  //     } else {
  //       setFetching(true);
  //       setFetchPrev(true);
  //       setOffsetPrev(0);
  //       setOffsetNext(0);
  //     }
  //   }
  // }, [roomData && roomData.id]);
  // console.log(toJS(roomData));
  // console.log(toJS(userStore.currentRoom));
  // useEffect(() => {
  //   console.log("roomData && !roomData.firstUnreadMessageIndex", roomData && toJS(roomData));
  //   // if (roomData && !roomData.firstUnreadMessageIndex) {
  //   //   setOffsetPrev(Number(roomData.firstUnreadMessageIndex));
  //   //   setOffsetNext(0);
  //   // } else {
  //   //   setOffsetPrev(0);
  //   //   setOffsetNext(0);
  //   // }
  //   if (roomData) {
  //     if (roomData.firstUnreadMessageIndex >= 5) {
  //       setOffsetPrev(roomData.firstUnreadMessageIndex);
  //       setOffsetNext(roomData.firstUnreadMessageIndex - 5 < 0 ? 0 : roomData.firstUnreadMessageIndex - 4);
  //       // setOffsetPrev(index - 4);
  //       // setOffsetNext(index - 4 - 5);
  //     }
  //     if (roomData.firstUnreadMessageIndex < 5) {
  //       setOffsetPrev(roomData.firstUnreadMessageIndex);
  //       setOffsetNext(0);
  //     }
  //   }
  //   // if (Number(index) >= 5) {
  //   //   console.log("index", index);
  //   //   setOffsetPrev(index - 4);
  //   //   setOffsetNext(index - 4 - 5);
  //   // } else {
  //   //   console.log("index) >= 5", index);
  //   //   setOffsetPrev(index);
  //   //   setOffsetNext(0);
  //   // }
  //   setFetching(true);
  //   setFetchPrev(true);
  // }, [roomData]);
  // console.log(toJS(userStore.currentRoom));
  useEffect(() => {
    // console.log("offsetNext", offsetNext);
    // console.log("offsetPrev", offsetPrev);
    // if (isFirstRender) {
    //   scrollToBottom();
    // }
    if (offsetNext === 0 && offsetPrev === limit && userStore.prevMessages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 20);
    }
    // scrollToBottom();
  }, [userStore.prevMessages.length, offsetNext]);

  useEffect(() => {
    socket.on("meeting", (data: IMessage) => {
      // scrollToBottom();
      // console.log(data);
      // userStore.setContacts();
    });

    socket.on("receive-message", (message: IMessage) => {
      console.log("receive-message");
      // console.log(`userStore.roomId  ${userStore.roomId}`);
      // console.log(`message ${message.roomId}`);
      // console.log(typeof userStore.roomId);
      // console.log(typeof message.roomId);
      // console.log("message.roomId", message.roomId);
      // console.log(`userStore.roomId  ${userStore.roomId}`);
      if (message.roomId === userStore.roomId) {
        if (userStore.prevMessages.length) {
          const lastMessage = userStore.prevMessages[userStore.prevMessages.length - 1].id;
          if (userStore.currentRoom.lastMessageId !== lastMessage) {
            userStore.clearMessages();
            resetFetchParams();
          } else {
            userStore.addMessage(message);
            setOffsetPrev((prev: any) => prev + 1);
          }
        } else {
          userStore.addMessage(message);
          setOffsetPrev((prev: any) => prev + 1);
        }

        userStore.updateCurrentRoomLastMsgId(message.id);
        setTimeout(() => {
          scrollToBottom();
        }, 20);
      }
      userStore.incrementUnreadCount(message);
      // scrollToBottom();
      // if (message.roomId === userStore.roomId) {
      //   userStore.incrementRoomUndeadIndex(message.roomId);
      // }
    });

    socket.on("forward-message", (message: IMessage) => {
      console.log("forward-message");
      // console.log(`userStore.roomId  ${userStore.roomId}`);
      // console.log(`message ${message.roomId}`);
      // console.log(typeof userStore.roomId);
      // console.log(typeof message.roomId);
      // console.log("message.roomId", message.roomId);
      // console.log(`userStore.roomId  ${userStore.roomId}`);
      if (message.roomId === userStore.roomId) {
        if (message.currentUserId !== userStore.user.id) {
          if (userStore.prevMessages.length) {
            const lastMessage = userStore.prevMessages[userStore.prevMessages.length - 1].id;
            if (userStore.currentRoom.lastMessageId !== lastMessage) {
              userStore.clearMessages();
              resetFetchParams();
            } else {
              userStore.addMessage(message);
              setOffsetPrev((prev: any) => prev + 1);
            }
          } else {
            userStore.addMessage(message);
            setOffsetPrev((prev: any) => prev + 1);
          }
        }
        userStore.updateCurrentRoomLastMsgId(message.id);
        setTimeout(() => {
          scrollToBottom();
        }, 20);
        // userStore.updateUnreadCount(message);
        // scrollToBottom();
      }
      // scrollToBottom();
      userStore.incrementUnreadCount(message);
      // if (message.roomId === userStore.roomId) {
      //   userStore.incrementRoomUndeadIndex(message.roomId);
      // }
    });

    socket.on("receive-file", (message: IMessage) => {
      console.log(`userStore.roomId  ${userStore.roomId}`);
      console.log(`message ${message}`);
      // console.log(typeof userStore.roomId);
      // console.log("filesCounter", userStore.filesCounter);
      if (message.roomId === userStore.roomId) {
        if (userStore.prevMessages.length) {
          const lastMessage = userStore.prevMessages[userStore.prevMessages.length - 1].id;
          if (userStore.currentRoom.lastMessageId !== lastMessage && userStore.filesCounter === 1) {
            userStore.clearMessages();
            resetFetchParams();
          } else {
            userStore.addMessage(message);
            setOffsetPrev((prev: any) => prev + 1);
            setTimeout(() => {
              scrollToBottom();
            }, 20);
          }
        } else {
          userStore.addMessage(message);
          setOffsetPrev((prev: any) => prev + 1);
          setTimeout(() => {
            scrollToBottom();
          }, 20);
        }

        userStore.updateCurrentRoomLastMsgId(message.id);
      }
      userStore.incrementUnreadCount(message);
      // if (message.roomId === userStore.roomId) {
      //   userStore.incrementRoomUndeadIndex(message.roomId);
      // }
    });

    socket.on("receive-reaction", (message: IMessage) => {
      console.log("receive-reaction");
      if (message.roomId === userStore.roomId) {
        userStore.updateMessage(message);
      }
    });

    socket.on("receive-message-status", (message: IMessage) => {
      if (message.roomId === userStore.roomId) {
        userStore.updateMessage(message);
      }

      userStore.decrementUnreadCount(message);
    });

    socket.on("receive-message-deleted", (message: IMessage) => {
      if (message.roomId === userStore.roomId) {
        userStore.updateMessage(message);
      }
    });

    socket.on("receive-typingState", (typingState: any) => {
      if (userStore.roomId === typingState.roomId && typingState.userId !== userStore.user.id) {
        setTypingUserData(typingState);
      } else setTypingUserData(null);
      // setTypingUserData(typingState);
    });

    socket.on("receive-userData", (user: any) => {
      // console.log(user);
      if (
        userStore.isAuth &&
        (findIndex(userStore.contacts, {
          id: user.id,
        }) !== -1 ||
          user.id === userStore.user.id)
      ) {
        userStore.updateUserData(user);
      }
      // else {
      //   userStore.setContacts();
      //   //userStore.setChatingWith(user);
      // }
      //userStore.updateUserData(user);unreadnone
      //userStore.setContacts();
      // userStore.setChatingWith(user);
    });

    socket.on("receive-newChatData", (res: any) => {
      if (res.includes(userStore.user.id)) {
        console.log("receive-newChatData", res);
        userStore.setContacts();
        // userStore.setUnreadCount();
        userStore.clearMessages();
        // console.log("userStore.contacts.length;", toJS(userStore.contacts.length));
      }

      // setTimeout(() => {
      //   // chatWithLastContact();
      //   console.log("userStore.contacts.length;", toJS(userStore.contacts.length));
      // }, 0);
    });

    socket.on("receive-groupData", (groupData: any) => {
      // console.log("receive-groupData", groupData);
      const participant = groupData.participants.filter((el: IGroupParticipant) => el.userId === userStore.user.id)[0];
      // console.log("participant", participant);
      const isGroupInContacts = userStore.contacts.findIndex((el: any) => el.chatId === groupData.id) !== -1;
      if (participant && !participant.isDeleted && isGroupInContacts) {
        // console.log("1");
        userStore.updateGroup(groupData);
      }
      if (participant && !participant.isDeleted && !isGroupInContacts) {
        // console.log("2");
        userStore.setContacts();
      }
      if (participant && participant.isDeleted && isGroupInContacts) {
        // console.log("3");
        userStore.setContacts();
        userStore.setChatingWith(null);
        userStore.setCurrentRoom(null);
        userStore.clearMessages();
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
        currentUserId: userStore.user.id,
        // recipientUserId: userStore.chatingWith.id,
        recipientUserId: userStore.chatingWith.email ? userStore.chatingWith.id : userStore.roomId,
        message: value,
        // contact:
        // status: IMessageStatus.SENT,
        parentMessage: userStore.parentMessage,
        roomId: userStore.roomId,
        readBy: userStore.user.id,
      };

      socket && socket.emit("send-message", message);
      // userStore.updateRooms(userStore.roomId, message.id);

      setTimeout(() => {
        setValue("");
        setRows(2);
        // scrollToBottom();
        if (userStore.parentMessage) {
          userStore.setParentMessage(null);
        }
      }, 0);
    }
  };
  // console.log(roomData);
  // console.log("offset", offset);
  // console.log(toJS(userStore.currentRoom && userStore.currentRoom));
  // console.log(messages);
  // console.log(userStore.chat);
  //console.log(userStore.chatingWith.id);
  // console.log(toJS(userStore));
  // console.log(toJS(userStore.chatingWith));
  // useEffect(() => {
  //   setTimeout(() => {
  //     scrollToBottom();
  //   }, 0);
  // }, [userStore.chat]);
  // console.log(userStore.chatingWith);
  // console.log(toJS(userStore.currentRoom));
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
  const showReplyToMessage = () => {
    setIsReplyToMessageOpen(true);
  };
  const hideReplyToMessage = () => {
    setIsReplyToMessageOpen(false);
  };
  const closeSearchMessagePopup = () => {
    setIsPopupSearchMessageOpen(false);
  };
  const openSearchMessagePopup = () => {
    setIsPopupSearchMessageOpen(true);
  };
  const [isPrinting, setIsPrinting] = useState(false);
  const handleChange = (e: any) => {
    // console.log("e.onChange", e.target);
    setCaretPos(e.target.selectionStart);
    setValue(e.target.value);
    const newLines = countLines(e.target);
    if (!newLines) setRows(2);
    if (newLines < 10) setRows(newLines + 1);
    else setRows(10);
  };

  useEffect(() => {
    if (value && focused) {
      setIsPrinting(true);
    } else setIsPrinting(false);
  }, [value, focused]);
  // console.log("focused", focused);
  useEffect(() => {
    socket.emit("update-typingState", { roomId: userStore.roomId, userId: userStore.user.id, isPrinting: isPrinting });
  }, [isPrinting]);

  // console.log("isPrinting", isPrinting);

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
      userStore.setMessageToForward(null);
      userStore.setContactToForward(null);
      userStore.clearSelectedUsers();
      // userStore.setCurrentRoom(null);
      closeEmojiReactionsPopup();
      closeDetailsPopup();
      closeForwardContactPopup();
      closeSearchMessagePopup();
    }
  };

  const closePopupFile = () => {
    setIsPopupFileOpen(false);
  };

  // const onEmojiClick = React.useCallback(
  //   (emoji: EmojiClickData) => {
  //     console.log(caretPos);
  //   },
  //   [caretPos],
  // );
  // console.log(userStore.chatingWith);
  // const handleInputFileChange = (e: any) => {
  //   const files = (e.target as HTMLInputElement).files;
  //   console.log(files);
  // };
  // console.log(toJS(userStore.contactToForward));
  // console.log(toJS(userStore.parentMessage));

  // you can access the elements with itemsRef.current[n]

  // console.log(itemsRef.current);
  const [isPopupAttachFileOpen, setIsPopupAttachFileOpen] = useState(false);
  const [filesToSend, setFilesToSend] = useState<any>([]);
  const [filesToRemove, setFilesToRemove] = useState<any>([]);
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
          currentUserId: userStore.user.id,
          // recipientUserId: userStore.chatingWith.id,
          recipientUserId: userStore.chatingWith.email ? userStore.chatingWith.id : userStore.roomId,
          message: index === 0 && value ? value : "",
          parentMessage: userStore.parentMessage,
          roomId: userStore.roomId,
          readBy: userStore.user.id,
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
        // userStore.setFilesCounter(index);
        // setFilesCounter(files.length);
        // userStore.updateRooms(userStore.roomId, message.id);
        setTimeout(() => {
          socket.emit("send-file", message);
          userStore.incrementFilesCounter();
          // setFilesCounter((prev) => prev + 1);
          setValue("");
          setRows(2);
          // setFilesCounter(0);
        }, 0);
      }
    }
    setIsPopupAttachFileOpen(false);
    setFilesToRemove([]);
    userStore.setFilesCounter(0);
    //setFilesCounter(0);
  };
  // console.log("filesCounter", filesCounter);
  const creactFileToSend = (fileData: any, type: string) => {
    var file = new File([fileData], "image.png", { type: type });
    // console.log(file);
    return file;
    // Создаем коллекцию файлов:
    // var dt = new DataTransfer();
    // dt.items.add(file);
    // var file_list = dt.files;

    // console.log("Коллекция файлов создана:");
    // console.dir(file_list);
  };
  const [fileFromClipboard, setFileFromClipboard] = useState<any>(null);
  const handleImagePaste = async (event: any) => {
    try {
      if (!navigator.clipboard) {
        console.error("Clipboard API not available");
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
      console.error("Failed to read clipboard:", err);
    }
  };
  const sendFileFromClipboard = async (e: any) => {
    e.preventDefault();
    const file = creactFileToSend(fileFromClipboard, "image/png");
    const form = new FormData();
    form.append("file", file);
    const data = {
      currentUserId: userStore.user.id,
      // recipientUserId: userStore.chatingWith.id,
      recipientUserId: userStore.chatingWith.email ? userStore.chatingWith.id : userStore.roomId,
      message: value ? value : "",
      parentMessage: userStore.parentMessage,
      roomId: userStore.roomId,
      readBy: userStore.user.id,
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
      // userStore.updateRooms(userStore.roomId, message.id);
      setValue("");
      setRows(2);
      setIsPopupFileOpen(false);
      setFileFromClipboard(null);
    }, 0);
  };

  // console.log("roomDataddddd", roomData && roomData.lastMessageId);
  const scrollHander = (e: WheelEvent) => {
    refMessages.current && setScroll(refMessages.current?.scrollHeight - refMessages.current?.scrollTop);

    const chartHeight = refMessages.current?.scrollHeight;
    const chartBottomPos =
      refMessages.current && refChart.current && refMessages.current?.scrollTop + refChart.current?.scrollHeight - 150;

    if (
      userStore.prevMessages.length &&
      refMessages.current &&
      refMessages.current?.scrollTop < 100 &&
      e.deltaY < 0 &&
      // userStore.prevMessages[0].id !== roomData.firstMessageId
      userStore.prevMessages[0].id !== userStore.currentRoom.firstMessageId
    ) {
      // console.log("set prev");
      setFetchPrev(true);
      setFetchNext(false);
      setFetching(true);
      // if (isFirstRender) {
      //   setOffsetPrev(5);
      // } else setOffsetPrev((prev: any) => prev + 5);
    }

    if (
      userStore.prevMessages.length &&
      e.deltaY > 0 &&
      userStore.prevMessages[userStore.prevMessages.length - 1].id !== userStore.currentRoom.lastMessageId &&
      // userStore.prevMessages[userStore.prevMessages.length - 1].id !== roomData.lastMessageId &&
      chartBottomPos &&
      chartHeight &&
      chartBottomPos - chartHeight > 0
    ) {
      // console.log("fetch next");
      // setFetching(true);
      setFetchNext(true);
      setFetchPrev(false);
      setFetching(true);
      // setOffsetNext((prev: any) => prev - 5);
    }
    // console.log("fetchNext", fetchNext);
    // console.log("fetchPrev", fetchPrev);
  };
  // console.log(toJS(roomData));
  // console.log("fetching", fetching);
  useEffect(() => {
    const chart = refMessages.current;

    chart && chart.addEventListener("wheel", scrollHander);

    return function () {
      chart && chart.removeEventListener("wheel", scrollHander);
    };
    // }, [roomData, userStore.prevMessages.length]);
  }, [userStore.currentRoom]);

  const fetchMessages = async () => {
    // console.log("fetchNext", fetchNext);
    // console.log("fetchPrev", fetchPrev);
    // console.log("offsetNext", offsetNext);
    // console.log("offsetPrev", offsetPrev);
    // console.log(" limit", limit);
    // console.log("userStore.prevMessages", toJS(userStore.prevMessages));

    try {
      // console.log("setNext", offsetNext);
      // console.log("offsetPrev", offsetPrev);
      const res = await getPrevMessage({
        limit,
        offset: fetchNext ? offsetNext : offsetPrev,
        roomId: userStore.roomId,
      });
      // console.log("res", res);
      const messages = res.reverse();
      // userStore.setMessages([...res, ...userStore.prevMessages]);
      // if (isFirstRender) {
      //   setOffset(5);
      // } else setOffset((prev: any) => prev + 5);
      if (fetchPrev) {
        userStore.setMessages([...messages, ...userStore.prevMessages]);
      }
      if (fetchNext) {
        userStore.setMessages([...userStore.prevMessages, ...messages]);
        // scrollToBottom();
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
  // console.log("fetching", fetching);
  // console.log("roomId", roomId);
  useEffect(() => {
    // console.log("fetching", fetching);
    // console.log(
    //   "userStore.prevMessages.length !== roomData.messagesTotal",
    //   userStore.prevMessages.length !== roomData.messagesTotal,
    // );
    // console.log("condition", fetching && roomData && userStore.prevMessages.length < roomData.messagesTotal);
    if (fetching) {
      // console.log("fetching", fetching);
      // if (fetchPrev) {
      //   if (isFirstRender) {
      //     setOffsetPrev(5);
      //   } else setOffsetPrev((prev: any) => prev + 5);
      // }
      // if (fetchNext) {
      //   setOffsetNext((prev: any) => {
      //     if (prev < 5 && prev > 0) {
      //       setLimit(prev);
      //       return 0;
      //     }
      //     if (prev === 0) {
      //       setLimit(5);
      //       return 0;
      //     } else {
      //       setLimit(5);
      //       return prev - 5;
      //     }
      //   });
      // }
      if (fetchPrev) {
        if (isFirstRender) {
          setOffsetPrev(limit);
        } else setOffsetPrev((prev: any) => prev + limit);
      }
      if (fetchNext) {
        setOffsetNext((prev: any) => {
          if (prev < 15 && prev > 0) {
            setLimit(prev);
            return 0;
          }
          if (prev === 0) {
            setLimit(15);
            return 0;
          } else {
            setLimit(15);
            return prev - 15;
          }
        });
      }

      fetchMessages();
    }
  }, [fetching]);

  // console.log("scroll", scroll);
  // useEffect(() => {
  // 	if (fetching && ordersAll.length !== total) {
  // 		fetchOrders();
  // 	}
  // }, [fetching]);
  // console.log(toJS(userStore.contactToForward));
  // console.log(toJS(userStore.prevMessages));
  // console.log("fetching", fetching);
  // console.log("roomData.messagesTotal", roomData);
  // console.log("userStore.prevMessages.length", userStore.prevMessages.length);
  // console.log("typingUserData", typingUserData);
  // if (isLoading) {
  //   return <Loader />;
  // }
  return (
    <div className={styles.wrapper} onClick={closeAllPopups} ref={refChart}>
      {userStore.chatingWith && (
        <div className={styles.contact}>
          {userStore.chatingWith.avatar ? (
            <img src={userStore.chatingWith.avatar} alt='Аватар' className={styles.contact__avatar} />
          ) : (
            <NoAvatar width={44} height={44} />
          )}
          <div className={styles.details}>
            <p className={styles.contact__name}>
              {userStore.chatingWith.userName ? userStore.chatingWith.userName : userStore.chatingWith.email}
            </p>

            {userStore.chatingWith.email && userStore.chatingWith.isOnline && <p className={styles.isOnline}>В сети</p>}
            {userStore.chatingWith.email && !userStore.chatingWith.isOnline && (
              <p className={styles.isOnline}>Не в сети</p>
            )}
          </div>
          <span className={styles.searchIcon} onClick={openSearchMessagePopup}>
            {" "}
            <SearchIcon color='white' />
          </span>

          <DetailsButton onClick={openDetailsPopup} />

          {userStore.chatingWith && userStore.chatingWith.email && (
            <ContactDetails
              {...userStore.chatingWith}
              onClick={() => {
                if (userStore.contacts.length > 1) {
                  userStore.setContactToForward(userStore.chatingWith);
                  openForwardContactPopup();
                }
              }}
              isPopupDetailsOpen={isPopupDetailsOpen}
            />
          )}
          {userStore.currentRoom && !userStore.chatingWith.email && (
            <PopupGroupDetails
              {...userStore.chatingWith}
              isPopupDetailsOpen={isPopupDetailsOpen}
              closeDetailsPopup={closeDetailsPopup}
            />
          )}
        </div>
      )}

      <div
        className={styles.content}
        style={{
          height: `calc(100% - 200px - ${rows * 18}px)`,
          marginTop: userStore.contacts.length === 0 ? "70px" : "0",
        }}
        ref={refMessages}
      >
        {isLoading && (
          <div style={{ marginTop: "25vh" }}>
            <Loader color='white' />
          </div>
        )}
        {userStore.prevMessages.length > 0 &&
          userStore.prevMessages.map((message: any, i: number, arr: any) => {
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
                  // setParentMessage={setParentMessage}
                  scrollToBottom={scrollToBottom}
                  // socket={socket}
                  roomId={userStore.roomId}
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

      {/* {userStore.parentMessage && <ReplyToElement {...userStore.parentMessage} />} */}
      <div style={{ position: "relative" }}>
        <div className={styles.container}>
          <EmojiIcon onClick={emojiToggle} />
          {userStore.chatingWith && userStore.chatingWith.email && typingUserData && typingUserData.isPrinting && (
            <TypingIndicator
              avatar={userStore.chatingWith.avatar}
              email={userStore.chatingWith.email}
              userName={userStore.chatingWith.userName}
            />
          )}
          {/* {userStore.chatingWith && !userStore.chatingWith.groupId && (
            <TypingIndicator
              avatar={userStore.chatingWith.avatar}
              email={userStore.chatingWith.email}
              userName={userStore.chatingWith.userName}
            />
          )} */}
          {userStore.chatingWith &&
            !userStore.chatingWith.email &&
            typingUserData &&
            typingUserData.isPrinting &&
            userStore.currentRoom.participants.map((user: any) => {
              if (user.userId === typingUserData.userId) {
                return (
                  <TypingIndicator key={user.userId} avatar={user.avatar} email={user.email} userName={user.userName} />
                );
              }
            })}
          {userStore.parentMessage && <ReplyToElement {...userStore.parentMessage} />}
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
            roomId={userStore.roomId}
            setFilesToSend={setFilesToSend}
            setFilesToRemove={setFilesToRemove}
            setIsPopupFileOpen={setIsPopupAttachFileOpen}
            isPopupFileOpen={isPopupAttachFileOpen}
          >
            <div className={styles.container} style={{ width: "100%", marginLeft: "0" }}>
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
              <ButtonSend right={15} bottom={3} onClick={() => sendMessageFile(filesToSend)} />
            </div>
          </InputFile>
          {/* <ButtonSend /> */}
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
        style={{ position: "absolute", transition: " all 0s linear" }}
        lazyLoadEmojis={true}
      />
      {isPopupFileOpen && (
        <OverLay closePopup={closePopupFile}>
          <div className={styles.popupWrapper}>
            <PopupImage image={imageSrc} />
            <form
              onSubmit={(e) => sendFileFromClipboard(e)}
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
              <ButtonSend right={15} bottom={3} />
            </form>
          </div>
        </OverLay>
      )}
      {userStore.chatingWith && (
        <PopupFoward
          currentContactId={userStore.chatingWith.id}
          isPopupForwardContact={isPopupForwardContact}
          messageToForward={userStore.messageToForward}
          contactToForward={userStore.contactToForward}
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
});

export default Chart;
