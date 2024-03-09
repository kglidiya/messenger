import { ReactNode } from "react";

import styles from "./Layout.module.css";

interface ILayout {
  children: ReactNode;
}

export default function Layout({ children }: ILayout) {
  return <main className={styles.wrapper}>{children}</main>;
}
