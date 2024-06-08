import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

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
