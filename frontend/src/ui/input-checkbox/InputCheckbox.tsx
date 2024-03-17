import { ChangeEvent } from "react";

import styles from "./InputCkeckbox.module.css";

interface ICheckbox {
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  //   label?: string;
}
export default function InputCheckbox({ name, onChange }: ICheckbox) {
  return (
    <div className={styles.container}>
      <input id={name} type='checkbox' className={styles.input} name={name} onChange={onChange} multiple />
      <label htmlFor={name} className={styles.label}>
        {/* {label} */}
      </label>
    </div>
  );
}
