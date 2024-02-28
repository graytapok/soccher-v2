import React, { createContext, useState } from "react";
import ConfirmEmail from "./components/ConfirmEmail";
import LoginForm from "./components/LoginForm";

export const LoginContext = createContext();

function LoginPage() {
  const [show, setShow] = useState("");
  const [userLogin, setUserLogin] = useState("");
  return (
    <LoginContext.Provider value={{ setShow, show, setUserLogin, userLogin }}>
      {show === "" ? <LoginForm /> : show === "confirm" && <ConfirmEmail />}
    </LoginContext.Provider>
  );
}

export default LoginPage;
