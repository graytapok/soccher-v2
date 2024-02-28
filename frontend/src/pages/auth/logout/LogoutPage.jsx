import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { Context } from "../../../App";

function LogoutPage() {
  const { logout } = useContext(Context);
  logout();
  return <Navigate to="/" replace />;
}

export default LogoutPage;
