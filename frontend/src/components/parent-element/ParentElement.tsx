import { observer } from "mobx-react-lite";

import { Document, Page, pdfjs } from "react-pdf";

import styles from "./ParentElement.module.css";

import { IContact, IMessageFile } from "../../utils/types";
import MessageContactElement from "../message-contact-element/MessageContactElement";

interface IParentElementProps {
  id: string;
  message: string;
  file: IMessageFile | null;
  contact: IContact | null;

  onClick: (id: string) => void;
}
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ParentElement = observer(({ id, message, file, contact, onClick }: IParentElementProps) => {
  return (
    <div className={styles.wrapper} onClick={() => onClick(id)}>
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
      {contact && <MessageContactElement {...contact} />}
    </div>
  );
});
export default ParentElement;
