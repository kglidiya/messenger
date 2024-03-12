import React from "react";

import styles from "./InputFile.module.css";

import Paperclip from "../icons/paperclip/Paperclip";

interface IInputFileProps {
  handleChange: any;
}
export default function InputFile({ handleChange }: IInputFileProps) {
  return (
    <>
      <input
        type='file'
        id='file'
        className={styles.input}
        multiple
        accept='video/*, image/*, audio/*, .docx, .doc. .pdf'
        onChange={handleChange}
      ></input>
      <label htmlFor='file' className={styles.label}>
        <Paperclip />
      </label>
    </>
  );
}
