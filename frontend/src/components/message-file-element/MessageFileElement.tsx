import { useState } from "react";
import { usePageVisibility } from "react-page-visibility";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./MessageFileElement.module.css";

import useMediaQuery from "../../hooks/useMediaQuery";
import DownLoadIcon from "../../ui/icons/download-icon/DownLoadIcon";
import Loader from "../../ui/loaders/loader/Loader";
import PdfLoader from "../../ui/loaders/pdf-loader/PdfLoader";
import { downloadFile } from "../../utils/helpers";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
interface IMessageFileElementProps {
  hover: boolean;
  path: string;
  type: string;
  name: string;
  openMessageActionsPopup: VoidFunction;
  isMessageFromMe: boolean;
}
export default function MessageFileElement({
  hover,
  path,
  type,
  name,
  openMessageActionsPopup,
  isMessageFromMe,
}: IMessageFileElementProps) {
  const isPageVisible = usePageVisibility();
  const [loaded, setLoaded] = useState(false);
  const matchesLarge = useMediaQuery("(min-width: 1200px)");
  // const matchesTablet = useMediaQuery("(max-width: 768px)");
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  return (
    <>
      {isPageVisible && type.includes("image") && (
        <>
          {loaded ? null : (
            <div className={styles.imageLoader}>
              <Loader color={isMessageFromMe ? "white" : "#ddd6c7"} />
            </div>
          )}
          <img
            className={loaded ? styles.imageVisible : styles.imageHidden}
            src={path}
            onLoad={() => setLoaded(true)}
            alt='Картинка'
            onClick={openMessageActionsPopup}
          />
        </>
      )}
      {type.includes("video") && (
        <video
          src={path}
          className={styles.video}
          controls
          muted
          onClick={openMessageActionsPopup}
          style={{ maxHeight: "40vh" }}
        ></video>
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
        onClick={() => downloadFile(path, name)}
        className={styles.downLoad}
        style={{
          left: isMessageFromMe ? 0 : "",
          right: !isMessageFromMe ? 0 : "",
          visibility: hover || matchesMobile ? "visible" : "hidden",
          opacity: hover || matchesMobile ? 1 : 0,
        }}
      >
        <DownLoadIcon fill='gray' />
      </span>
    </>
  );
}
