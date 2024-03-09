import { ReactNode } from "react";

import styles from "./OverLay.module.css";

interface IOverLayProps {
  children: ReactNode;
}

export default function OverLay({ children }: IOverLayProps) {
  return <div className={`${styles.overlay} `}>{children}</div>;
}
