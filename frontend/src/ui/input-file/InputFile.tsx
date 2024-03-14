import React, { ReactNode, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styles from "./InputFile.module.css";

import OverLay from "../../components/overlay/Overlay";
import DeleteIcon from "../icons/delete-icon/DeleteIcon";
import Paperclip from "../icons/paperclip/Paperclip";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface IInputFileProps {
  children: ReactNode;
}
export default function InputFile({ children }: IInputFileProps) {
  const [files, setFiles] = useState<any>([]);
  // const [numPages, setNumPages] = useState<number>();
  // const [pageNumber, setPageNumber] = useState<number>(1);
  const [isPopupFileOpen, setIsPopupFileOpen] = useState(false);
  const closeFilePopup = () => {
    setIsPopupFileOpen(false);
    setFiles([]);
  };

  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  // setNumPages(numPages);
  // }
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
    const validFiles = [];
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // console.log(file);
        validFiles.push({ fileContent: await readFiles(file), fileName: file.name });
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
  };
  return (
    <>
      <input
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
                  if (file.fileContent.startsWith("data:image")) {
                    return (
                      <div style={{ position: "relative", width: "fit-content", justifySelf: "center" }} key={i}>
                        <DeleteIcon onClick={() => removeFile(i)} />
                        <img src={file.fileContent} alt='' className={styles.image} onClick={() => removeFile(i)} />
                      </div>
                    );
                  }
                  if (file.fileContent.startsWith("data:application/pdf")) {
                    return (
                      <div style={{ position: "relative", width: "fit-content" }} key={i}>
                        <DeleteIcon onClick={() => removeFile(i)} />
                        <Document file={file.fileContent}>
                          <Page pageNumber={1} scale={0.5} className={styles.pdf} />
                        </Document>
                      </div>
                    );
                  }
                  if (file.fileContent.startsWith("data:video/mp4")) {
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
