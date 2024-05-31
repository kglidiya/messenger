import React, { MouseEventHandler, useState } from "react";
import { usePageVisibility } from "react-page-visibility";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./MessageFileElement.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import DownLoadIcon from "../../ui/icons/download-icon/DownLoadIcon";
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
  const isPageVisible = usePageVisibility();
  const [loaded, setLoaded] = useState(false);
  const matchesLarge = useMediaQuery("(min-width: 1200px)");
  const matchesTablet = useMediaQuery("(max-width: 768px)");
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  return (
    <>
      {type.includes("image") && (
        <>
          {loaded ? null : <div className={styles.imageLoader} />}
          <img
            className={loaded ? styles.image : styles.imageHidden}
            src={path}
            onLoad={() => setLoaded(true)}
            alt='Картинка'
            onClick={openMessageActionsPopup}
          />
        </>
      )}
      {type.includes("video") && (
        <video src={path} className={styles.video} controls muted onClick={openMessageActionsPopup}></video>
      )}
      {isPageVisible && type.includes("pdf") && (
        <div onClick={openMessageActionsPopup} style={{ zIndex: 5, position: "relative", cursor: "pointer" }}>
          <Document file={path} loading={<PdfLoader />}>
            <Page
              pageNumber={1}
              scale={matchesLarge ? 0.4 : matchesMobile ? 0.3 : 0.2}
              className={styles.pdf}
              renderTextLayer={false}
            />
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
          visibility: hover || matchesMobile ? "visible" : "hidden",
          opacity: hover || matchesMobile ? 1 : 0,
          // transition: "all 0.3s linear",
        }}
      >
        <DownLoadIcon fill='gray' />
      </span>
    </>
  );
}
