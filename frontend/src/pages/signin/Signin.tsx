/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Signin.module.css";

import { Context } from "../..";
import useMediaQuery from "../../hooks/useMediaQuery";
import Button from "../../ui/button/Button";

import Logo from "../../ui/icons/Logo/Logo";
import Input from "../../ui/input/Input";
import { emailRegex } from "../../utils/helpers";

const Signin = observer(() => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ values: { email: "", password: "" } });
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const store = useContext(Context)?.store;
  const navigate = useNavigate();

  const onSubmit = (values: { email: string; password: string }) => {
    store?.login({
      email: values.email.toLowerCase(),
      password: values.password,
      isOnline: true,
    });
  };

  useEffect(() => {
    store?.clearError();
  }, []);

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
    <section className={styles.container}>
      <h3 className={styles.title}>Вход</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} id='signin'>
        <Logo width={100} height={100} top={matchesMobile ? -180 : -115} right={0} color='#eae2cc' />
        <Input
          type='text'
          placeholder='Email'
          name='email'
          pattern={emailRegex}
          required={true}
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
          required={false}
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
          text='Войти'
          width={!matchesMobile ? "300px" : "95%"}
          fontSize={!matchesMobile ? "24px" : "18px"}
        />
        {store?.error && <p className={styles.error}>{store?.error}</p>}
      </form>
      <div className={styles.singupGroup}>
        <p className={styles.text}>Вы - новый пользователь?</p>
        <Link to='/signup' className={styles.link}>
          Зарегистрироваться
        </Link>
      </div>
      <div className={styles.singupGroup}>
        <p className={styles.text}>Забыли пароль?</p>
        <Link to='/forgot-password' className={styles.link}>
          Восстановить
        </Link>
      </div>
    </section>
  );
});

export default Signin;
