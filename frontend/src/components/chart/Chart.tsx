import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import styles from "./Chart.module.css";

import { Context } from "../..";
import ButtonSend from "../../ui/button-send/ButtonSend";
import DetailsButton from "../../ui/details-button/DetaillsButton";
import Globe from "../../ui/globe/Globe";
import EmojiIcon from "../../ui/icons/emoji/EmojiIcon";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import InputFile from "../../ui/input-file/InputFile";
import Textarea from "../../ui/textarea/Textarea";
import { countLines, findUserById } from "../../utils/helpers";
import { users, messages } from "../../utils/mockData";
import Message from "../message/Message";
import OverLay from "../overlay/Overlay";
import ContactDetails from "../popup-contact-details/ContactDetails";
import PopupFoward from "../popup-foward/PopupFoward";
import PopupImage from "../popup-image/PopupImage";

const Chart = observer(() => {
  const userStore = useContext(Context).user;
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [value, setValue] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const [rows, setRows] = useState(2);
  const [imageSrc, setImageSrc] = useState("");
  const [isPopupFileOpen, setIsPopupFileOpen] = useState(false);
  const [messageClicked, setMessageClicked] = useState("");
  const [isPopupReactionOpen, setIsPopupReactionOpen] = useState(false);
  const [isPopupMessageActionsOpen, setIsPopupMessageActionsOpen] = useState(false);
  const [isPopupEmojiReactionsOpen, setIsPopupEmojiReactionsOpen] = useState(false);
  const [isPopupDetailsOpen, setIsPopupDetailsOpen] = useState(false);
  const [isPopupForwardContact, setIsPopupForwardContact] = useState(false);
  const [isReplyToMessageOpen, setIsReplyToMessageOpen] = useState(true);
  const [parentMessage, setParentMessage] = useState("");
  const [currentContact, setCurrentContact] = useState<any>({});
  const ref = useRef<HTMLDivElement>(null);
  const refChart = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    ref.current?.scrollIntoView();
  };
  // console.log(userStore.chat.length);

  useEffect(() => {
    userStore.setChat(userStore.user.id, userStore.chatingWith);
    closeDetailsPopup();
  }, [userStore.user.id, userStore.chatingWith]);

  useEffect(() => {
    setCurrentContact(findUserById(users, userStore.chatingWith)[0]);
  }, [userStore.chatingWith]);

  useEffect(() => {
    scrollToBottom();
  }, [userStore.chat.length]);

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
  // console.log(messageClicked);
  // const [emojiPickerPos, setEmojiPickerPos] = useState({ position: "absolute", bottom: "75px", left: "10px" });

  const handleImagePaste = async (event: any) => {
    try {
      if (!navigator.clipboard) {
        console.error("Clipboard API not available");
        return;
      }

      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.find((type) => type.startsWith("image/"));
        console.log(clipboardItem.types);
        if (imageTypes) {
          const blob = await clipboardItem.getType(imageTypes);
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
  const onSubmit = (value: any) => {
    console.log(value);
  };

  const handleChange = (e: any) => {
    setCaretPos(e.target.selectionStart);
    setValue(e.target.value);
    const newLines = countLines(e.target);
    if (!newLines) setRows(2);
    else if (newLines < 10) setRows(newLines + 1);
    else setRows(10);
  };

  const onEmojiClick = (emoji: any) => {
    setValue(value.slice(0, caretPos) + emoji + value.slice(caretPos));
  };

  const emojiToggle = () => {
    setIsEmojiOpen(!isEmojiOpen);
  };

  const closeEmoji = (e: any) => {
    if (e.target.nodeName === "DIV") {
      setIsEmojiOpen(false);
      closeReactionPopup();
      closeMessageActionsPopup();
      closeEmojiReactionsPopup();
      closeDetailsPopup();
      closeForwardContactPopup();
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
  // console.log(currentContact);
  const [contentEditable, setContentEditable] = useState(false);
  return (
    <div className={styles.wrapper} onClick={closeEmoji} ref={refChart}>
      <div className={styles.contact}>
        {currentContact.avatar ? (
          <img src={currentContact.avatar} alt='Аватар' className={styles.contact__avatar} />
        ) : (
          <NoAvatar width={44} height={44} />
        )}
        <p className={styles.contact__name}>
          {currentContact.username ? currentContact.username : currentContact.email}
        </p>
        <DetailsButton onClick={openDetailsPopup} />

        <ContactDetails
          {...currentContact}
          onClick={() => openForwardContactPopup()}
          isPopupDetailsOpen={isPopupDetailsOpen}
        />
      </div>
      <div className={styles.content} style={{ height: `calc(100% - 120px - ${rows * 18}px)` }}>
        {userStore.chat.length > 0 &&
          userStore.chat.map((message: any, i: number) => {
            return (
              <Message
                {...message}
                key={i}
                setMessageClicked={setMessageClicked}
                isPopupReactionOpen={isPopupReactionOpen && messageClicked === message.id}
                openReactionPopup={openReactionPopup}
                isPopupMessageActionsOpen={isPopupMessageActionsOpen && messageClicked === message.id}
                openMessageActionsPopup={openMessageActionsPopup}
                isPopupEmojiReactionsOpen={isPopupEmojiReactionsOpen && messageClicked === message.id}
                openEmojiReactionsPopup={openEmojiReactionsPopup}
                openForwardContactPopup={openForwardContactPopup}
                closeMessageActionsPopup={closeMessageActionsPopup}
                setParentMessage={setParentMessage}
                scrollToBottom={scrollToBottom}
              />
            );
          })}

        <div ref={ref} style={{ margin: 0 }}></div>
      </div>

      <Globe />
      {parentMessage && (
        <div className={styles.replyContainer}>
          <p className={styles.reply}>{parentMessage}</p>
        </div>
      )}
      <div style={{ position: "relative" }}>
        <div className={styles.container}>
          <EmojiIcon onClick={emojiToggle} />
          <Textarea
            rows={rows}
            value={value}
            handleChange={handleChange}
            handleImagePaste={handleImagePaste}
            onClick={(e: any) => setCaretPos(e.target.selectionStart)}
          />
          <InputFile>
            <div className={styles.container}>
              <EmojiIcon onClick={emojiToggle} />
              <Textarea
                rows={2}
                value={value}
                handleChange={handleChange}
                handleImagePaste={handleImagePaste}
                onClick={(e: any) => setCaretPos(e.target.selectionStart)}
              />
              {/* <ButtonSend /> */}
            </div>
          </InputFile>
          {/* <ButtonSend /> */}
        </div>
        <ButtonSend />
      </div>

      <EmojiPicker
        onEmojiClick={(emojiData) => {
          console.log(emojiData);
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
            <div className={styles.container}>
              <EmojiIcon onClick={emojiToggle} />
              <Textarea
                rows={rows}
                value={value}
                handleChange={handleChange}
                handleImagePaste={handleImagePaste}
                onClick={(e: any) => setCaretPos(e.target.selectionStart)}
              />
              <ButtonSend />
            </div>
          </div>
        </OverLay>
      )}
      <PopupFoward currentContactId={currentContact.id} isPopupForwardContact={isPopupForwardContact} />
    </div>
  );
});

export default Chart;
