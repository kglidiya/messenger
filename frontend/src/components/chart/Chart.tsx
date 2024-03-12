import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import styles from "./Chart.module.css";

import { Context } from "../..";
import ButtonSend from "../../ui/button-send/ButtonSend";
import Globe from "../../ui/globe/Globe";
import EmojiIcon from "../../ui/icons/emoji/EmojiIcon";
import InputFile from "../../ui/input-file/InputFile";
import Textarea from "../../ui/textarea/Textarea";
import { countLines } from "../../utils/helpers";
import { users, messages } from "../../utils/mockData";
import Message from "../message/Message";
import OverLay from "../overlay/Overlay";
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
  const ref = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ block: "end" });
  };
  // console.log(userStore.chat.length);

  useEffect(() => {
    userStore.setChat(userStore.user.id, userStore.chatingWith);
  }, [userStore.user.id, userStore.chatingWith]);

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
  const handleInputFileChange = (e: any) => {
    const files = (e.target as HTMLInputElement).files;
    console.log(files);
  };

  return (
    <div className={styles.wrapper} onClick={closeEmoji}>
      <div className={styles.contact}>
        <img src={users[0].avatar} alt='Аватар' className={styles.contact__avatar} />
        <p className={styles.contact__name}>{users[0].username}</p>
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
              />
            );
          })}
        <div ref={ref}></div>
      </div>
      {/* <div ref={ref} /> */}

      <Globe />
      <div className={styles.container}>
        <EmojiIcon onClick={emojiToggle} />
        <Textarea
          rows={rows}
          value={value}
          handleChange={handleChange}
          handleImagePaste={handleImagePaste}
          onClick={(e: any) => setCaretPos(e.target.selectionStart)}
        />
        <InputFile handleChange={handleInputFileChange} />
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
                // width='calc(100% - 50px)'
              />
              <ButtonSend />
            </div>
          </div>
        </OverLay>
      )}
    </div>
  );
});

export default Chart;
