import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

import "./index.scss";

import { App } from "./components/app/App";
import AppStore from "./store/AppStore";

export const Context = createContext<any>(null);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <Context.Provider
    value={{
      user: new AppStore(),
    }}
  >
    <App />
  </Context.Provider>,
  // </React.StrictMode>,
);
