import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
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
  const matches = useMediaQuery("(min-width: 576px)");
  const userStore = useContext(Context)?.user;
  const navigate = useNavigate();

  //   const [status, setStatus] = useState<IStatus<undefined | IUser>>({
  //     isloading: false,
  //     data: undefined,
  //     error: "",
  //   });

  const onSubmit = (values: any) => {
    userStore.setAuth(true);
    navigate("/");
    // handleRequest(status, setStatus, SIGN_IN_URL, "POST", values);
    //cartStore.setCart(status, setStatus);
  };

  //   useEffect(() => {
  //     if (status.data) {
  //       user.setUser(status.data);
  //       user.setIsAuth(true);
  //       navigate("/");
  //     }
  //   }, [navigate, status.data, user]);

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Вход</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Logo top={-115} right={0} color='#eae2cc' />
        <Input
          type='text'
          placeholder='Email'
          name='email'
          // pattern={emailRegex}
          required={false}
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
          // pattern={/.{4,}/}
          register={register}
          error={errors}
          errorMessage={
            errors?.password?.type === "required" ? "Заполните это поле" : "Пароль должен содержать минимум 4 символа"
          }
          clearButton
          setValue={setValue}
        />

        <Button type='submit' text='Войти' width={matches ? "300px" : "95%"} fontSize={matches ? "24px" : "18px"} />
        {/* {status.error && <p className={styles.error}>{status.error}</p>} */}
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
