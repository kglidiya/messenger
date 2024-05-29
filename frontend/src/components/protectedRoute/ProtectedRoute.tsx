import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Context } from "../..";

export const ProtectedRoute = observer(() => {
  const store = useContext(Context).user;

  const location = useLocation();

  return store.isAuth ? <Outlet /> : <Navigate to='/signin' state={{ from: location }} replace />;
});

export default ProtectedRoute;
