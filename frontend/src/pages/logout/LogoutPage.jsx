import React, { useContext } from "react";
import { Context } from "../../App";
import { Navigate } from "react-router-dom";

function LogoutPage() {
  const { logout } = useContext(Context);
  logout();
  return <Navigate to="/" replace />;
}

export default LogoutPage;
