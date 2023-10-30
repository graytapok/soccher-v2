import React from "react";
import { Route, Routes } from "react-router-dom";
import { nav } from "./navigation";
import { AuthData } from "./AuthWrapper";
import useAuth from "../hooks/useAuth";

const RenderRoutes = () => {
  /* const { user } = AuthData(); */
  const auth = useAuth();
  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && auth) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return false;
      })}
    </Routes>
  );
};

export default RenderRoutes;
