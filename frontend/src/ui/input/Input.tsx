import styles from "./Input.module.css";

interface IInput {
  type?: string;
  placeholder?: string;
  name: string;
  label?: string;
  register: any;
  required: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  error?: any;
  errorMessage?: string;
  clearButton?: boolean;
  setValue?: any;
  // onChange?: ChangeEventHandler<HTMLInputElement>;
  onChange?: any;
  onInput?: any;
  value?: any;
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
  clearButton,
  setValue,
  onChange,
  onInput,
  value,
}: IInput) => {
  // console.log(error)
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        onInput={onInput}
        placeholder={placeholder}
        type={type}
        autoComplete='off'
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
        value={value}
      />
      {error?.[`${name}`] && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
};

export default Input;
