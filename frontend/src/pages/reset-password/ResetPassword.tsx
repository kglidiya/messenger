import { useEffect, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styles from "./ResetPassword.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import Button from "../../ui/button/Button";
import Logo from "../../ui/icons/Logo/Logo";
import Input from "../../ui/input/Input";
import { resetPassword } from "../../utils/api";
interface FormValues {
  password: string;
  repeatPassword: string;
  code: string;
}
const ResetPassword = () => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      password: "",
      repeatPassword: "",
      code: "",
    },
  });

  const navigate = useNavigate();
  const matchesMobile = useMediaQuery("(max-width: 576px)");

  const onSubmit = (values: FormValues) => {
    resetPassword({
      recoveryCode: Number(values.code),
      password: values.password,
    });
    // handleRequest(status, setStatus, `${RESET_PASSWORD_URL}`, "POST", {
    //   recoveryCode: Number(values.code),
    //   password: values.password,
    // });
    navigate("/signin");
  };

  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Восстановление пароля</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Logo width={100} height={100} top={matchesMobile ? -180 : -115} right={0} color='#eae2cc' />
        {/* <h3 className={styles.title}>Восстановление пароля</h3> */}

        <Input
          type='password'
          placeholder='Введите новый пароль'
          name='password'
          required
          pattern={/.{4,}/}
          register={register}
          error={errors}
          errorMessage={
            errors?.password?.type === "required" ? "Заполните это поле" : "Пароль должен содержать минимум 4 символа"
          }
          clearButton
          setValue={setValue}
        />

        <Input
          type='password'
          placeholder='Повторите пароль'
          name='repeatPassword'
          required
          pattern={new RegExp(watch("password"))}
          register={register}
          error={errors}
          errorMessage={errors?.repeatPassword?.type === "required" ? "Заполните это поле" : "Пароли должны совпадать"}
          clearButton
          setValue={setValue}
        />

        <p className={styles.subtitle}>Введите код восстановления</p>
        <Input
          type='number'
          placeholder='Введите код'
          name='code'
          required
          register={register}
          error={errors}
          errorMessage='Заполните это поле'
          clearButton
          setValue={setValue}
        />
        <Button
          type='submit'
          text='Отправить'
          width={!matchesMobile ? "300px" : "95%"}
          fontSize={!matchesMobile ? "24px" : "18px"}
        />
        {/* {status.error && <p className={styles.error}>{status.error}</p>} */}
      </form>
    </main>
  );
};

export default ResetPassword;
