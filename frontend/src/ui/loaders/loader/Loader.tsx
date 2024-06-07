/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";

import LoaderStyles from "./Loader.module.css";

interface ILoaderProps {
  width?: string;
  color: string;
}

const Loader: FC<ILoaderProps> = ({ width, color }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--loader-color", `${color}`);
  }, []);

  return (
    <div className={LoaderStyles.container} style={{ width }}>
      <div className={LoaderStyles.lds_roller}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Loader;
