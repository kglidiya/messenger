import React, { MouseEventHandler, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./MessageFileElement.module.css";

import DownLoadIcon from "../../ui/icons/download-icon/DownLoadIcon";
import Loader from "../../ui/loader/Loader";
import { downloadFile } from "../../utils/helpers";
import PdfLoader from "../pdf-loader/PdfLoader";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface IMessageFileElementProps {
  hover: boolean;
  path: string;
  type: string;
  name: string;
  openMessageActionsPopup: VoidFunction;
  myMessage: boolean;
}
export default function MessageFileElement({
  hover,
  path,
  type,
  name,
  openMessageActionsPopup,
  myMessage,
}: IMessageFileElementProps) {
  return (
    <>
      {type.includes("image") && (
        <img src={path} alt='Картинка' className={styles.image} onClick={openMessageActionsPopup} />
      )}
      {type.includes("video") && (
        <video src={path} className={styles.video} controls muted onClick={openMessageActionsPopup}></video>
      )}
      {type.includes("pdf") && (
        <div onClick={openMessageActionsPopup} style={{ zIndex: 5, position: "relative", cursor: "pointer" }}>
          <Document file={path} loading={<PdfLoader />}>
            <Page pageNumber={1} scale={0.4} className={styles.pdf} renderTextLayer={false} />
          </Document>
        </div>
      )}
      {!type.includes("pdf") && !type.includes("video") && !type.includes("image") && (
        <span className={styles.file} onClick={openMessageActionsPopup}>
          <p className={styles.fileName}>{name}</p>
        </span>
      )}
      <span
        onClick={() => downloadFile(path)}
        className={styles.icon}
        style={{
          left: myMessage ? 0 : "",
          right: !myMessage ? 0 : "",
          visibility: hover ? "visible" : "hidden",
          opacity: hover ? 1 : 0,
          // transition: "all 0.3s linear",
        }}
      >
        <DownLoadIcon fill='gray' />
      </span>
    </>
  );
}
