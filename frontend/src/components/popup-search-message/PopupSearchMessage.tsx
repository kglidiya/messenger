import { motion } from "framer-motion";
import React, { ChangeEventHandler, useContext, useState } from "react";

import { useForm } from "react-hook-form";

import styles from "./PopupSearchMessage.module.css";

import { Context } from "../..";
import useDebounce from "../../hooks/useDebounce";
import useMediaQuery from "../../hooks/useMediaQuery";
import ButtonSend from "../../ui/button-send/ButtonSend";
import NoAvatar from "../../ui/icons/no-avatar/NoAvatar";
import ShareIcon from "../../ui/icons/share-icon/ShareIcon";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";
import TrashIcon from "../../ui/icons/trash-icon/TrashIcon";

import Input from "../../ui/input/Input";
import { findMessages } from "../../utils/api";
import { getDate } from "../../utils/helpers";
interface IContactDetailsProps {
  // id: string;
  scrollIntoView: any;
  onClick?: VoidFunction;
  isPopupSearchMessageOpen: boolean;
}
export default function PopupSearchMessage({
  // id,
  scrollIntoView,
  onClick,
  isPopupSearchMessageOpen,
}: IContactDetailsProps) {
  const userStore = useContext(Context).user;
  const { register, handleSubmit, setValue, watch } = useForm({ values: { query: "" } });
  const [searchResult, setSearchResult] = useState<any>([]);
  const matches = useMediaQuery("(min-width: 576px)");
  //   const [status, setStatus] = useState<IStatus<any>>({
  //     isloading: false,
  //     data: undefined,
  //     error: "",
  //   });

  const searchMessages = async (query: string) => {
    //navigate("/reset-password");
    console.log(query);
    try {
      if (query.length > 1) {
        const res = await findMessages({
          query: query,
          roomId: userStore.roomId,
        });
        if (res.length) {
          setSearchResult(res);
        } else setSearchResult("Поиск не дал результата");
      }
    } catch (e: any) {
      console.log(e);
    }
    // handleRequest(status, setStatus, `${FORGOT_PASSWORD_URL}`, "POST", values);
  };
  const debouncedSearch = useDebounce(searchMessages, 1000);
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = () => {
    debouncedSearch(watch("query"));
  };
  console.log(searchResult);
  return (
    <motion.section
      className={styles.wrapper}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isPopupSearchMessageOpen ? 1 : 0, opacity: isPopupSearchMessageOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.inputContainer}>
        <Input
          type='text'
          placeholder='Поиск сообщений'
          name='query'
          required
          register={register}
          onChange={handleInputChange}
          // errorMessage='Введите корректный email'
          clearButton
          setValue={setValue}
        />
      </div>

      {/* <ButtonSend onClick={undefined} top={15} right={10} /> */}

      <ul className={styles.list}>
        {" "}
        {Array.isArray(searchResult) &&
          searchResult.length > 0 &&
          searchResult.map((el: any, i: number) => {
            return (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.2 }}
                className={styles.list__item}
                key={el.id}
                onClick={() => {
                  scrollIntoView(el.id);
                }}
              >
                <p className={styles.date}>{getDate(el.createdAt)}</p>
                {el.message && <p className={styles.message}> {el.message}</p>}
                {el.contact && <p className={styles.message}> {el.contact.email}</p>}
                {el.contact && <p className={styles.message}> {el.contact.userName}</p>}
              </motion.li>
            );
          })}
      </ul>
      {searchResult === "Поиск не дал результата" && (
        <div className={styles.noResult}>
          <p>{searchResult}</p>
          <ShrugIcon color='#ddd6c7' />
        </div>
      )}
    </motion.section>
  );
}
