import { toJS } from "mobx";
import React, { useContext, useEffect, useState } from "react";

import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

import styles from "./App.module.css";

import { Context } from "../..";
import AppRouter from "../app-router/AppRouter";
import HelmetSeo from "../helmet/Helmet";

export function App() {
  // const userStore = useContext(Context).user;
  // const [messageCounter, setMessageCounter] = useState(0);
  // useEffect(() => {
  //   const unread = userStore.unreadCount.reduce((acc: any, curr: any) => {
  //     return acc + curr.unread;
  //   }, 0);
  //   console.log("unread", unread);
  //   setMessageCounter(unread);
  // }, [userStore.unreadCount.length]);
  // console.log("messageCounter", messageCounter);
  return (
    <HelmetProvider>
      <HelmetSeo />
      <Router>
        <AppRouter />
      </Router>
    </HelmetProvider>
  );
}
