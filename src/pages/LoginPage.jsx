import useAuth from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import React from "react";

function LoginPage() {
  return (
    <>
      <LoginForm correct={true} ></LoginForm>
    </>
  );
}

export default LoginPage;
