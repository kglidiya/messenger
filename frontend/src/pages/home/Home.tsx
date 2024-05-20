import React, { useContext, useEffect, useState } from "react";

import styles from "./Home.module.css";

import { Context } from "../..";
import Chart from "../../components/chart/Chart";
import SideBar from "../../components/side-bar/SideBar";
import withWebSocket, { SocketProvider } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const matches = useMediaQuery("(max-width: 805px)");
  if (matches) {
    return (
      <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <p style={{ color: "#f8f3e9" }}>Мобильная версия в разработке</p>
        <ShrugIcon color='#f8f3e9' />
      </div>
    );
  }
  return (
    <SocketProvider>
      <div className={styles.content}>
        <SideBar isLoading={isLoading} />
        <Chart isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </SocketProvider>
  );
};
export default Home;
