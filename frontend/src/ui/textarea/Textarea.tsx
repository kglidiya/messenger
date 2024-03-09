import React from "react";

import styles from "./Textarea.module.css";

interface ITextarea {
  rows: number;
  value: string;
  handleChange: any;
  handleImagePaste?: any;
  onClick: any;
  width?: string;
}

export default function Textarea({ rows, value, handleChange, handleImagePaste, onClick, width }: ITextarea) {
  return (
    <textarea
      rows={rows}
      className={styles.textarea}
      value={value}
      onChange={handleChange}
      onPaste={handleImagePaste}
      onClick={onClick}
      style={{ width }}
    ></textarea>
  );
}
