import { useState } from "react";

import styles from "./Home.module.css";

import Chart from "../../components/chart/Chart";
import SideBar from "../../components/side-bar/SideBar";
import { SocketProvider } from "../../hoc/SocketProvider";

const Home = () => {
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isContactsVisible, setIsContactsVisible] = useState(true);

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
          setIsLoadingMessages={setIsLoadingMessages}
          isContactsVisible={isContactsVisible}
          setIsContactsVisible={setIsContactsVisible}
          setIsLoadingContacts={setIsLoadingContacts}
        />
      </div>
    </SocketProvider>
  );
};
export default Home;
