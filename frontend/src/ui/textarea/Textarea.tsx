import React, { forwardRef, useEffect, useRef } from "react";

import styles from "./Textarea.module.css";

interface ITextarea {
  rows: number;
  value: string;
  handleChange: any;
  handleImagePaste?: any;
  onClick: any;
  width?: string;
  setFocused?: any;
}

const Textarea = forwardRef<HTMLTextAreaElement, ITextarea>(
  ({ rows, value, handleChange, handleImagePaste, onClick, width, setFocused }, ref) => {
    // const ref = useRef<HTMLTextAreaElement>(null);
    // const handleInput = (e: any) => {
    //   console.log("ref", ref.current);
    //   // if(ref.current)
    // };
    // useEffect(() => {

    // }, []);
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        onPaste={handleImagePaste}
        onClick={onClick}
        style={{ width }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete='off'
        autoFocus
        // onInput={handleInput}
      ></textarea>
    );
  },
);

export default Textarea;
