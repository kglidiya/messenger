import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styles from "./InputFile.module.css";

import OverLay from "../../components/overlay/Overlay";
import useMediaQuery from "../../hooks/useMediaQuery";
import { readFiles } from "../../utils/helpers";

import DeleteIcon from "../icons/delete-icon/DeleteIcon";
import Paperclip from "../icons/paperclip/Paperclip";
import ImageSnippet from "../image-snippet/ImageSnippet";
import PdfLoader from "../loaders/pdf-loader/PdfLoader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface IInputFileProps {
  children: ReactNode;
  roomId: string;
  setFilesToSend: Dispatch<SetStateAction<FileList | []>>;
  setFilesToRemove: Dispatch<SetStateAction<string[]>>;
  setIsPopupFileOpen: Dispatch<SetStateAction<boolean>>;
  isPopupFileOpen: boolean;
}

interface IFile {
  fileContent: string;
  fileName: string;
  size: number;
  type: string;
}
export default function InputFile({
  children,
  setFilesToSend,
  setFilesToRemove,
  setIsPopupFileOpen,
  isPopupFileOpen,
}: IInputFileProps) {
  const [files, setFiles] = useState<IFile[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const matchesMobile = useMediaQuery("(max-width: 576px)");
  const closeFilePopup = () => {
    setIsPopupFileOpen(false);
    setFiles([]);
    setFilesToSend([]);
  };

  const handleInputFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    setFilesToSend(files as FileList);
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
    setFiles((prev) => prev.filter((_, index) => index !== i));
    setFilesToRemove((prev) => prev.concat(files[i].fileName));
  };

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
                files.map((file, i) => {
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
                          <Page pageNumber={1} scale={matchesMobile ? 0.3 : 0.4} className={styles.pdf} />
                        </Document>
                      </div>
                    );
                  }
                  if (file.type.startsWith("video")) {
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
          </div>
        </OverLay>
      )}
    </>
  );
}
