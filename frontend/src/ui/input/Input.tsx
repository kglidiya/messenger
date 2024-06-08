import { ChangeEventHandler } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import styles from "./Input.module.css";

interface IInput {
  type?: string;
  placeholder?: string;
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  required: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  error?: FieldErrors<any>;
  errorMessage?: string;
  clearButton?: boolean;
  setValue?: UseFormSetValue<any>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
const Input = ({
  type,
  placeholder,
  name,
  label,
  register,
  required,
  maxLength,
  minLength,
  min,
  max,
  pattern,
  error,
  errorMessage,
  onChange,
}: IInput) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        autoComplete='on'
        {...register(name, {
          onChange,
          required,
          maxLength,
          minLength,
          pattern,
          max,
          min,
        })}
        className={styles.input}
        autoFocus
      />
      {error?.[`${name}`] && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
};

export default Input;
