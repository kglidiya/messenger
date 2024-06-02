import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./ParentElement.module.css";

import { Context } from "../..";
import { IMessage } from "../../utils/types";
import MessageContactElement from "../messageContactElement/MessageContactElement";

interface IParentElementProps {
  id: string;
  message: string;
  file: any;
  contact: any;
  // parentMessage: IMessage;
  onClick: any;
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ParentElement = observer(({ id, message, file, contact, onClick }: IParentElementProps) => {
  const store = useContext(Context).user;
  console.log(toJS(contact));
  return (
    <div className={styles.wrapper} onClick={() => onClick(id)}>
      {message && <p className={styles.reply}>{message}</p>}
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
      {contact && <MessageContactElement {...contact} />}
    </div>
  );
});
export default ParentElement;
