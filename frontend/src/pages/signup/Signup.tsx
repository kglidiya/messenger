/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Signup.module.css";

import { Context } from "../..";

import useMediaQuery from "../../hooks/useMediaQuery";
import Button from "../../ui/button/Button";
import Logo from "../../ui/icons/Logo/Logo";
import Input from "../../ui/input/Input";
import { emailRegex } from "../../utils/helpers";

const Signup = observer(() => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ values: { email: "", password: "" } });
  const store = useContext(Context)?.store;
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const navigate = useNavigate();

  const onSubmit = (values: { email: string; password: string }) => {
    store?.registerUser({
      email: values.email.toLowerCase(),
      password: values.password,
      isOnline: true,
    });
  };

  useEffect(() => {
    if (store?.user && store.user.id) {
      store.setAuth(true);
      store.clearError();
      setTimeout(() => {
        navigate("/");
      }, 0);
    }
  }, [store?.user]);

  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Регистрация</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} id='signup'>
        <Logo width={100} height={100} top={matchesMobile ? -180 : -115} right={0} color='#eae2cc' />
        <Input
          type='text'
          placeholder='Email'
          name='email'
          pattern={emailRegex}
          required
          register={register}
          error={errors}
          errorMessage={errors?.email?.type === "required" ? "Заполните это поле" : "Введите корректный email"}
          clearButton
          setValue={setValue}
        />
        <Input
          type='password'
          placeholder='Пароль'
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
        <Button
          type='submit'
          text='Зарегистрироваться'
          width={!matchesMobile ? "300px" : "95%"}
          fontSize={!matchesMobile ? "24px" : "18px"}
        />
        {store?.error && <p className={styles.error}>{store?.error}</p>}
      </form>
      <div className={styles.singupGroup}>
        <p className={styles.text}>Вы уже зарегистированы?</p>
        <Link
          to='/signin'
          className={styles.link}
          onClick={() => {
            store?.clearError();
          }}
        >
          Войти
        </Link>
      </div>
    </main>
  );
});

export default Signup;
