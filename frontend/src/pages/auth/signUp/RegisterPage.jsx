import React, { createContext, useState } from "react";
import RegisterForm from "./components/RegisterForm";
import RegisterComplete from "./components/RegisterComplete";
import Heading from "../../../components/Heading";

export const RegisterContext = createContext();

function RegisterPage() {
  const [complete, setComplete] = useState(false);
  return (
    <RegisterContext.Provider value={{ setComplete }}>
      {!complete ? (
        <RegisterForm />
      ) : (
        <>
          <Heading title="Sign Up"></Heading>
          <RegisterComplete />
        </>
      )}
    </RegisterContext.Provider>
  );
}

export default RegisterPage;
