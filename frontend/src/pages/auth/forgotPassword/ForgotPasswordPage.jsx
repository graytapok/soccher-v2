import React, { createContext, useState } from "react";
import ForgotPasswordComplete from "./components/ForgotPasswordComplete";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export const ForgotPasswordPageContext = createContext();

function ForgotPasswordPage() {
  const [show, setShow] = useState("form");
  return (
    <ForgotPasswordPageContext.Provider value={{ setShow }}>
      {show === "form" ? <ForgotPasswordForm /> : <ForgotPasswordComplete />}
    </ForgotPasswordPageContext.Provider>
  );
}

export default ForgotPasswordPage;
