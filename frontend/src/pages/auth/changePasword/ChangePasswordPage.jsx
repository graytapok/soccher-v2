import React, { createContext, useState } from "react";
import { useLocation } from "react-router-dom";
import ChangePasswordForm from "./components/ChangePasswordForm";
import ChangePasswordComplete from "./components/ChangePasswordComplete";

export const ChangePasswordPageContext = createContext();

export default function ChangePasswordPage() {
  const url = useLocation();
  const token = url.pathname.slice(17);
  const [show, setShow] = useState("");

  return (
    <ChangePasswordPageContext.Provider value={{ setShow }}>
      {show === "" ? (
        <ChangePasswordForm token={token} />
      ) : (
        <ChangePasswordComplete />
      )}
    </ChangePasswordPageContext.Provider>
  );
}
