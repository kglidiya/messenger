import React from "react";

import styles from "./Home.module.css";

import Chart from "../../components/chart/Chart";
import SideBar from "../../components/side-bar/SideBar";

export function Home() {
  return (
    // <div className={styles.wrapper}>
    <div className={styles.content}>
      <SideBar />
      {/* <Layout> */}
      <Chart />
      {/* </Layout> */}
    </div>
    // </div>
  );
}
