import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./ParentElement.module.css";

import { Context } from "../..";
import { IMessage } from "../../utils/types";
import MessageContactElement from "../messageContactElement/MessageContactElement";

interface IParentElementProps {
  parentMessage: IMessage;
  onClick: any;
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ParentElement = observer(({ parentMessage, onClick }: IParentElementProps) => {
  const store = useContext(Context).user;
  // console.log(toJS(parentMessage));
  return (
    <div className={styles.wrapper} onClick={() => onClick(parentMessage.id)}>
      {parentMessage.message && <p className={styles.reply}>{parentMessage.message}</p>}
      {parentMessage.file && (
        <>
          {parentMessage.file.type.includes("image") && (
            <img src={parentMessage.file.path} alt='Картинка' className={styles.image} />
          )}
          {parentMessage.file.type.includes("video") && (
            <video src={parentMessage.file.path} className={styles.image} muted></video>
          )}
          {parentMessage.file.type.includes("pdf") && (
            <Document file={parentMessage.file.path} className={styles.pdf} loading={"Загрузка pdf..."}>
              <Page pageNumber={1} scale={0.08} />
            </Document>
          )}
          {!parentMessage.file.type.includes("pdf") &&
            !parentMessage.file.type.includes("video") &&
            !parentMessage.file.type.includes("image") && (
              <div className={styles.file}>
                <p className={styles.fileName}>{parentMessage.file.name}</p>
              </div>
            )}
        </>
      )}
      {parentMessage.contact && <MessageContactElement contact={parentMessage.contact} />}
    </div>
  );
});
export default ParentElement;
