import React, { useContext, useEffect, useState } from "react";

import styles from "./Home.module.css";

import { Context } from "../..";
import Chart from "../../components/chart/Chart";
import SideBar from "../../components/side-bar/SideBar";
import withWebSocket, { SocketProvider } from "../../hoc/SocketProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import ShrugIcon from "../../ui/icons/shrug-icon/ShrugIcon";

const Home = () => {
  const [isLoadingContacts, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
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
        <SideBar isLoadingContacts={isLoadingContacts} isLoadingMessages={isLoadingMessages} />
        <Chart isLoadingMessages={isLoadingMessages} setIsLoading={setIsLoadingMessages} />
      </div>
    </SocketProvider>
  );
};
export default Home;
