import React, { useContext } from "react";
import { Context } from "../App";
import { Navigate } from "react-router-dom";

function LogoutPage() {
  const { user, logout } = useContext(Context);
  if (user.auth) {
    logout();
  }
  return <Navigate to="/" replace />;
}

export default LogoutPage;
