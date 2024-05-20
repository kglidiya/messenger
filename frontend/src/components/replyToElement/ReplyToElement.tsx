import React, { useContext } from "react";

import { Document, Page, pdfjs } from "react-pdf";

import styles from "./ReplyToElement.module.css";

import { Context } from "../..";
import CloseIcon from "../../ui/icons/closeIcon/CloseIcon";
import MessageContactElement from "../messageContactElement/MessageContactElement";

interface IReplyToElementProps {
  message: string;
  file: any;
  contact: any;
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ReplyToElement({ message, file, contact }: IReplyToElementProps) {
  // console.log(contact);
  const userStore = useContext(Context).user;
  return (
    <div className={styles.wrapper}>
      {message && <p className={styles.message}>{message}</p>}
      {file && (
        <>
          {file.type.includes("image") && <img src={file.path} alt='Картинка' className={styles.image} />}
          {file.type.includes("video") && <video src={file.path} className={styles.image} muted></video>}
          {file.type.includes("pdf") && (
            <Document file={file.path} className={styles.pdf} loading={"Загрузка pdf..."}>
              <Page pageNumber={1} scale={0.08} />
            </Document>
          )}
          {!file.type.includes("pdf") && !file.type.includes("video") && !file.type.includes("image") && (
            <div className={styles.file}>
              <p className={styles.fileName}>{file.name}</p>
            </div>
          )}
        </>
      )}
      {contact && (
        <div className={styles.contact}>
          <MessageContactElement contact={contact} />
        </div>
      )}
      <button
        onClick={() => {
          userStore.setParentMessage(null);
        }}
        className={styles.button}
      />
    </div>
  );
}
