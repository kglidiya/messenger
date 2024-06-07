import { createContext } from "react";
import ReactDOM from "react-dom/client";

import "./index.scss";

import { App } from "./components/app/App";
import AppStore from "./store/AppStore";
import { IContext } from "./utils/types";

export const Context = createContext<IContext | null>(null);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Context.Provider
    value={{
      store: new AppStore(),
    }}
  >
    <App />
  </Context.Provider>,
);
