import { FC } from "react";

import LoaderStyles from "./LoaderButton.module.css";

interface ILoaderProps {
  width?: string;
}

const LoaderButton: FC<ILoaderProps> = ({ width }) => {
  return (
    <div className={LoaderStyles.container} style={{ width }}>
      <span className={LoaderStyles.loader}></span>
    </div>
  );
};

export default LoaderButton;
