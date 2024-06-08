import { motion } from "framer-motion";
import { ChangeEventHandler, useContext, useState } from "react";

import { useForm } from "react-hook-form";

import styles from "./PopupSearchMessage.module.css";

import { Context } from "../..";
import useDebounce from "../../hooks/useDebounce";

import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";

import Input from "../../ui/input/Input";
import { findMessages } from "../../utils/api";
import { decrypt, getDate } from "../../utils/helpers";
import { IMessage } from "../../utils/types";
interface IContactDetailsProps {
  scrollIntoView: (id: string) => void;
  isPopupSearchMessageOpen: boolean;
}
export default function PopupSearchMessage({ scrollIntoView, isPopupSearchMessageOpen }: IContactDetailsProps) {
  const store = useContext(Context)?.store;
  const { register, setValue, watch } = useForm({ values: { query: "" } });
  const [searchResult, setSearchResult] = useState<IMessage[] | string>([]);

  const searchMessages = async (query: string) => {
    try {
      if (query.length > 1) {
        const res = await findMessages({
          query: query,
          roomId: store?.roomId as string,
        });
        if (res.length) {
          setSearchResult(res);
        } else setSearchResult("Поиск не дал результата");
      }
    } catch (err) {
      console.error("Произошла ошибка:", err);
    }
  };
  const debouncedSearch = useDebounce(searchMessages, 1000);
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = () => {
    debouncedSearch(watch("query"));
  };

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
          clearButton
          setValue={setValue}
        />
      </div>
      <ul className={styles.list}>
        {" "}
        {Array.isArray(searchResult) &&
          searchResult.length > 0 &&
          searchResult.map((el, i) => {
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
                {el.message && <p className={styles.message}> {decrypt(el.message)}</p>}
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
