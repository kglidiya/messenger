import React, { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styles from "./InputFile.module.css";

import { Context } from "../..";
import OverLay from "../../components/overlay/Overlay";
import PdfLoader from "../../components/pdf-loader/PdfLoader";
import { SocketContext } from "../../hoc/SocketProvider";
import { chunkFile } from "../../utils/helpers";
import { IMessage } from "../../utils/types";
import ButtonSend from "../button-send/ButtonSend";
import DeleteIcon from "../icons/delete-icon/DeleteIcon";
import Paperclip from "../icons/paperclip/Paperclip";
import ImageSnippet from "../image-snippet/ImageSnippet";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface IInputFileProps {
  children: ReactNode;
  roomId: string;
  setFilesToSend: any;
  setFilesToRemove: any;
  setIsPopupFileOpen: any;
  isPopupFileOpen: boolean;
}

const { v4: uuidv4 } = require("uuid");

export default function InputFile({
  children,
  roomId,
  setFilesToSend,
  setFilesToRemove,
  setIsPopupFileOpen,
  isPopupFileOpen,
}: IInputFileProps) {
  const [files, setFiles] = useState<any>([]);
  const ref = useRef<HTMLInputElement>(null);
  // const [filesToSend, setFilesToSend] = useState<any>([]);
  const socket = useContext(SocketContext);
  const userStore = useContext(Context).user;
  // const [roomId, setRoomId] = useState<string>("");
  // const [numPages, setNumPages] = useState<number>();
  // const [pageNumber, setPageNumber] = useState<number>(1);
  // const [isPopupFileOpen, setIsPopupFileOpen] = useState(false);
  const closeFilePopup = () => {
    setIsPopupFileOpen(false);
    setFiles([]);
    setFilesToSend([]);
  };

  const readFiles = (file: any) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target?.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };
  const handleInputFileChange = async (e: any) => {
    const files = (e.target as HTMLInputElement).files;
    setFilesToSend(files);
    console.log(files);
    const validFiles = [];
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size < 104857600) {
          validFiles.push({
            fileContent: await readFiles(file),
            fileName: file.name,
            size: file.size,
            type: file.type,
          });
        } else {
          validFiles.push({
            fileContent: "",
            fileName: file.name,
            size: file.size,
            type: file.type,
          });
        }
      }
      if (validFiles.length) {
        setFiles(validFiles);
        setIsPopupFileOpen(true);
        return;
      }
    }
  };
  // console.log(files);
  const removeFile = (i: number) => {
    setFiles((prev: any) => prev.filter((_: any, index: number) => index !== i));
    setFilesToRemove((prev: any) => prev.concat(files[i].fileName));
  };
  // useEffect(() => {
  //   setFilesToSend(files);
  // }, [files.length]);
  // const sendMessage = async (files: FileList) => {
  //   for (let index = 0; index < files.length; index++) {
  //     const form = new FormData();
  //     form.append("file", files[index]);
  //     const data = {
  //       currentUserId: userStore.user.id,
  //       recipientUserId: userStore.chatingWith.id,
  //       parentMessage: userStore.parentMessage,
  //       roomId: roomId,
  //       form,
  //     };
  //     const message = await sendFile(form, data);

  //     setTimeout(() => {
  //       socket.emit("send-file", message);
  //     }, 0);
  //   }
  //   closeFilePopup();
  // };
  return (
    <>
      <input
        ref={ref}
        type='file'
        id='file'
        className={styles.input}
        multiple
        accept='video/*, image/*, audio/*, .docx, .doc, .pdf'
        onChange={handleInputFileChange}
      ></input>
      <label htmlFor='file' className={styles.label}>
        <Paperclip />
      </label>
      {isPopupFileOpen && files.length > 0 && (
        <OverLay closePopup={closeFilePopup}>
          <div>
            <div className={styles.container}>
              {files.length > 0 &&
                files.map((file: any, i: number) => {
                  console.log(file);
                  if (file.type.startsWith("image")) {
                    return (
                      <div style={{ position: "relative", width: "fit-content", justifySelf: "center" }} key={i}>
                        <DeleteIcon onClick={() => removeFile(i)} />
                        <img src={file.fileContent} alt='' className={styles.image} onClick={() => removeFile(i)} />
                        {file.size > 104857600 && (
                          <>
                            <ImageSnippet />
                            <p className={styles.warning}>
                              Файл не может быть отправлен т.к. его зармер превышает 100 МБ
                            </p>
                          </>
                        )}
                      </div>
                    );
                  }
                  if (file.fileContent.startsWith("data:application/pdf")) {
                    return (
                      <div style={{ position: "relative", width: "fit-content" }} key={i}>
                        <DeleteIcon onClick={() => removeFile(i)} />
                        <Document file={file.fileContent} loading={<PdfLoader color='white' />}>
                          <Page pageNumber={1} scale={0.5} className={styles.pdf} />
                        </Document>
                      </div>
                    );
                  }
                  if (file.type.startsWith("video/mp4")) {
                    return (
                      <div style={{ position: "relative", width: "fit-content" }} key={i}>
                        <DeleteIcon onClick={() => removeFile(i)} />
                        <video
                          src={`${file.fileContent}`}
                          className={styles.video}
                          controls
                          muted
                          onClick={() => removeFile(i)}
                        ></video>
                        {file.size > 104857600 && (
                          <p className={styles.warning}>
                            Файл не может быть отправлен т.к. его зармер превышает 100 МБ
                          </p>
                        )}
                      </div>
                    );
                  } else
                    return (
                      <div className={styles.file} key={i}>
                        <DeleteIcon onClick={() => removeFile(i)} />
                        <p className={styles.fileName}>{file.fileName}</p>
                      </div>
                    );
                })}
            </div>
            {children}
            {/* <ButtonSend onClick={() => sendMessage(filesToSend)} /> */}
            {/* <button onClick={() => sendMessage(filesToSend)}>send</button> */}
          </div>
        </OverLay>
      )}
    </>
  );
}
