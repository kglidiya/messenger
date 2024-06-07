import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import styles from "./AppRouter.module.css";

import ForgotPassword from "../../pages/forgot-password/ForgotPassword";
import Home from "../../pages/home/Home";
import ResetPassword from "../../pages/reset-password/ResetPassword";
import Signin from "../../pages/signin/Signin";
import Signup from "../../pages/signup/Signup";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";

export const AppRouter = () => {
  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    return () => {
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);

  return (
    <main className={styles.main}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path={"/"} element={<Home />} />
        </Route>
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/signin"} element={<Signin />} />
        <Route path={"/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/reset-password"} element={<ResetPassword />} />
      </Routes>
    </main>
  );
};
export default AppRouter;
