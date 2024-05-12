import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import styles from "./InputCkeckbox.module.css";

interface ICheckbox {
  name: string;
  isPopupForwardContact: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  //   label?: string;
}
const InputCheckbox = forwardRef<HTMLInputElement, ICheckbox>(({ name, isPopupForwardContact, onChange }, ref) => {
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);
  useEffect(() => {
    if (!isPopupForwardContact) {
      innerRef.current!.checked = false;
    }
  }, [isPopupForwardContact]);
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
        // checked={true}
        // checked={checked}
      />
      <label htmlFor={name} className={styles.label}></label>
    </div>
  );
});

export default InputCheckbox;
