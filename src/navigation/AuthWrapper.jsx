import { createContext, useContext, useEffect, useState } from "react";
import RenderRoutes from "./RenderRoutes";
import React from "react";
import Navbar from "../components/Navbar";

export const AuthData = React.createContext({
  username: "",
  email: "",
  auth: false,
});

export const AuthWrapper = () => {
  const [user, setUser] = useState();

  const login = () => {
    setUser({ ...user, auth: true });
  };

  const logout = () => {
    setUser({ ...user, auth: false });
  };

  return (
    <AuthData.Provider value={{ user, login, logout }}>
      <>
        <Navbar />
        <RenderRoutes />
      </>
    </AuthData.Provider>
  );
};
