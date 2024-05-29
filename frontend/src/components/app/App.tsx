import { toJS } from "mobx";
import React, { useContext, useEffect, useState } from "react";

import { HelmetProvider } from "react-helmet-async";
import { usePageVisibility } from "react-page-visibility";
import { BrowserRouter as Router } from "react-router-dom";

import styles from "./App.module.css";

import { Context } from "../..";
import AppRouter from "../app-router/AppRouter";
import HelmetSeo from "../helmet/Helmet";

export function App() {
  return (
    <HelmetProvider>
      <HelmetSeo />
      <Router>
        <AppRouter />
      </Router>
    </HelmetProvider>
  );
}
