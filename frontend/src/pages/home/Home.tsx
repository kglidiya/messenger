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
  const [isContactsVisible, setIsContactsVisible] = useState(true);
  const [isChartVisible, setIsChartVisible] = useState(true);
  const matches = useMediaQuery("(min-width: 576px)");
  // if (matches) {
  //   return (
  //     <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
  //       <p style={{ color: "#f8f3e9" }}>Мобильная версия в разработке</p>
  //       <ShrugIcon color='#f8f3e9' />
  //     </div>
  //   );
  // }
  // useEffect(() => {
  //   if (matches) {
  //     setIsChartVisible(false);
  //   } else setIsChartVisible(true);
  //   if (isContactsVisible) {
  //     setIsContactsVisible(false);
  //   } else setIsContactsVisible(true);
  // }, [matches]);
  return (
    <SocketProvider>
      <div className={styles.content}>
        <SideBar
          isLoadingContacts={isLoadingContacts}
          isLoadingMessages={isLoadingMessages}
          isContactsVisible={isContactsVisible}
          setIsContactsVisible={setIsContactsVisible}
        />

        <Chart
          isLoadingMessages={isLoadingMessages}
          setIsLoading={setIsLoadingMessages}
          isContactsVisible={isContactsVisible}
          setIsContactsVisible={setIsContactsVisible}
        />
      </div>
    </SocketProvider>
  );
};
export default Home;
