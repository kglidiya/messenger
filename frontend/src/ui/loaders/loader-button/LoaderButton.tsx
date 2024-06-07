/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";

import LoaderStyles from "./LoaderButton.module.css";

interface ILoaderProps {
  width?: string;
  // color: string;
}

const LoaderButton: FC<ILoaderProps> = ({ width }) => {
  // useEffect(() => {
  //   document.documentElement.style.setProperty("--loader-color", `${color}`);
  // }, []);

  return (
    <div className={LoaderStyles.container} style={{ width }}>
      <span className={LoaderStyles.loader}></span>
    </div>
  );
};

export default LoaderButton;
