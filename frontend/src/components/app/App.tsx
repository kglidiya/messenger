import React from "react";

import styles from "./App.module.css";

import Chart from "../chart/Chart";
import Layout from "../layout/Layout";
import SideBar from "../side-bar/SideBar";

export function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <SideBar />
        <Layout>
          <Chart />
        </Layout>
      </div>
    </div>
  );
}
