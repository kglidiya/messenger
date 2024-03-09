import React from "react";

import styles from "./InputFile.module.css";

import Paperclip from "../icons/paperclip/Paperclip";

export default function InputFile() {
  return (
    <>
      <input
        type='file'
        id='file'
        className={styles.input}
        multiple
        accept='video/*, image/*, audio/*, .docx, .doc. .pdf'
      ></input>
      <label htmlFor='file' className={styles.label}>
        <Paperclip />
      </label>
    </>
  );
}
