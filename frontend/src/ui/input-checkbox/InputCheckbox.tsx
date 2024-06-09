import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import styles from "./InputCkeckbox.module.css";

interface ICheckbox {
  name: string;
  isPopupForwardOpen: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
const InputCheckbox = forwardRef<HTMLInputElement, ICheckbox>(({ name, isPopupForwardOpen, onChange }, ref) => {
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);
  useEffect(() => {
    if (!isPopupForwardOpen) {
      innerRef.current!.checked = false;
    }
  }, [isPopupForwardOpen]);
  return (
    <div className={styles.container}>
      <input
        id={name}
        type='checkbox'
        className={styles.input}
        name={name}
        onChange={onChange}
        value={name}
        ref={innerRef}
      />
      <label htmlFor={name} className={styles.label}></label>
    </div>
  );
});

export default InputCheckbox;
