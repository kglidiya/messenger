import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styles from "./ForgotPassword.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import Button from "../../ui/button/Button";
import Logo from "../../ui/icons/Logo/Logo";
import Input from "../../ui/input/Input";
import { getRecoveryCode } from "../../utils/api";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ values: { email: "" } });

  const navigate = useNavigate();
  const matchesMobile = useMediaQuery("(max-width: 576px)");

  const onSubmit = (values: { email: string }) => {
    getRecoveryCode(values);
    navigate("/reset-password");
  };

  return (
    <main className={styles.container}>
      <h3 className={styles.title}>Восстановление пароля</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate id='resetPass'>
        <Logo width={100} height={100} top={matchesMobile ? -180 : -115} right={0} color='#eae2cc' />
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
          width={!matchesMobile ? "300px" : "95%"}
          fontSize={!matchesMobile ? "24px" : "18px"}
        />
      </form>
    </main>
  );
};

export default ForgotPassword;
