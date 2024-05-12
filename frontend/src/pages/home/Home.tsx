import React, { useContext, useEffect } from "react";

import styles from "./Home.module.css";

import { Context } from "../..";
import Chart from "../../components/chart/Chart";
import SideBar from "../../components/side-bar/SideBar";
import withWebSocket, { SocketProvider } from "../../hoc/SocketProvider";

const Home = () => {
  return (
    <SocketProvider>
      <div className={styles.content}>
        <SideBar />
        <Chart />
      </div>
    </SocketProvider>
  );
};
export default Home;
