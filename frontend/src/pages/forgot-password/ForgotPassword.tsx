import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styles from "./ForgotPassword.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import Button from "../../ui/button/Button";
import Logo from "../../ui/icons/Logo/Logo";
import Input from "../../ui/input/Input";
import { getRecoveryCode } from "../../utils/api";
// import { setCookie } from "../../utils/cookies";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ values: { email: "" } });

  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 576px)");
  //   const [status, setStatus] = useState<IStatus<any>>({
  //     isloading: false,
  //     data: undefined,
  //     error: "",
  //   });

  const onSubmit = (values: any) => {
    //navigate("/reset-password");
    getRecoveryCode(values);
    navigate("/reset-password");
    // handleRequest(status, setStatus, `${FORGOT_PASSWORD_URL}`, "POST", values);
  };
  //   useEffect(() => {
  //     if (status.data) {
  //       setCookie("recoveryCode", String(status.data), {
  //         path: "/",
  //         expires: 60000,
  //       });
  //       navigate("/reset-password");
  //     }
  //   }, [status.data]);

  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Восстановление пароля</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Logo width={100} height={100} top={-115} right={0} color='#eae2cc' />
        <Input
          type='email'
          placeholder='Email'
          name='email'
          required
          register={register}
          error={errors}
          errorMessage='Введите корректный email'
          clearButton
          setValue={setValue}
        />

        <Button
          type='submit'
          text='Восстановить'
          width={matches ? "300px" : "95%"}
          fontSize={matches ? "24px" : "18px"}
        />
      </form>
    </main>
  );
};

export default ForgotPassword;
