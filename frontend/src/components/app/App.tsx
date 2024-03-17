import React from "react";

import { BrowserRouter as Router } from "react-router-dom";

import styles from "./App.module.css";

import AppRouter from "../app-router/AppRouter";

export function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}
