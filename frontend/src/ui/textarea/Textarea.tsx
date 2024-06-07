import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, forwardRef } from "react";

import styles from "./Textarea.module.css";

interface ITextarea {
  rows: number;
  value: string;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleImagePaste?: () => Promise<void>;
  onClick: (e: MouseEvent<HTMLTextAreaElement>) => void;
  width?: string;
  setFocused?: Dispatch<SetStateAction<boolean>>;
}

const Textarea = forwardRef<HTMLTextAreaElement, ITextarea>(
  ({ rows, value, handleChange, handleImagePaste, onClick, width, setFocused }, ref) => {
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
        onFocus={() => setFocused?.(true)}
        onBlur={() => setFocused?.(false)}
        autoComplete='off'
        autoFocus
      ></textarea>
    );
  },
);

export default Textarea;
