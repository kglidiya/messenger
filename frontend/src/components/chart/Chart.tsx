import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "./Chart.module.css";

import Globe from "../../ui/globe/Globe";
import EmojiIcon from "../../ui/icons/emoji/EmojiIcon";
import Input from "../../ui/input/Input";
import { countLines } from "../../utils/helpers";
import { contacts, messages } from "../../utils/mockData";
import MessageFrom from "../message/Message";
import OverLay from "../overlay/Overlay";
import PopupImage from "../popup-image/PopupImage";

export default function Chart() {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [value, setValue] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const [rows, setRows] = useState(2);
  const [imageSrc, setImageSrc] = useState("");

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
          break;
        }
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };
  // console.log(imageSrc);

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
    }
  };
  // console.log(pos);
  // const onEmojiClick = React.useCallback(
  //   (emoji: EmojiClickData) => {
  //     console.log(caretPos);
  //   },
  //   [caretPos],
  // );

  return (
    <div className={styles.wrapper} onClick={closeEmoji}>
      <div className={styles.contact}>
        <img src={contacts[0].avatar} alt='Аватар' className={styles.contact__avatar} />
        <p className={styles.contact__name}>{contacts[0].name}</p>
      </div>
      <div className={styles.content} style={{ height: `calc(100% - 120px - ${rows * 18}px)` }}>
        {messages.map((message, i: number) => {
          return <MessageFrom {...message} key={i} />;
        })}
      </div>

      <Globe />
      <div className={styles.container}>
        <EmojiIcon onClick={emojiToggle} />
        <textarea
          rows={rows}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onPaste={handleImagePaste}
          onClick={(e: any) => setCaretPos(e.target.selectionStart)}
        ></textarea>
      </div>
      <EmojiPicker
        onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
        key={caretPos}
        autoFocusSearch={false}
        open={isEmojiOpen}
        className={styles.emoji}
        style={{ position: "absolute" }}
      />
      {imageSrc && <OverLay children={<PopupImage image={imageSrc} />} />}
    </div>
  );
}