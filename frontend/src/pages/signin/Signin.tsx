import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Signin.module.css";

import { Context } from "../..";
import { SocketContext } from "../../hoc/SocketProvider";
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
  const store = useContext(Context)?.user;
  const navigate = useNavigate();
  //   const [status, setStatus] = useState<IStatus<undefined | IUser>>({
  //     isloading: false,
  //     data: undefined,
  //     error: "",
  //   });

  const onSubmit = (values: any) => {
    // console.log(values);
    store.login({
      email: values.email.toLowerCase(),
      password: values.password,
      isOnline: true,
    });

    // setIsLoading(true)
    // setTimeout(() => {
    //   console.log(toJS(store.user));
    //   store.setAuth(true);
    //   // store.setContacts();
    //   // const data = {
    //   //   userId: store.user.id,
    //   //   isOnline: true,
    //   // };
    //   // socket && socket.emit("update-userData", data);
    //   navigate("/");
    // }, 0);
  };
  useEffect(() => {
    if (store.user && store.user.id) {
      // console.log(toJS(store.user));
      store.setAuth(true);
      store.clearError();
      // store.setContacts();
      // const data = {
      //   userId: store.user.id,
      //   isOnline: true,
      // };
      // socket && socket.emit("update-userData", data);
      setTimeout(() => {
        navigate("/");
      }, 0);
    }
  }, [store.user]);
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
        <Logo width={100} height={100} top={-115} right={0} color='#eae2cc' />
        <Input
          type='text'
          placeholder='Email'
          name='email'
          // pattern={emailRegex}
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
        {store.error && <p className={styles.error}>{store.error}</p>}
        {/* <p className={styles.error}>Вы - новый пользователь</p> */}
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
