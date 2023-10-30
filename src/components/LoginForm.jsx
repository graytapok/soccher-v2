import React, { useState, useContext } from "react";
import Button from "./Button";
import bcrypt from "bcryptjs";
import { Context } from "../App";
import "./styles/LoginForm.css";

function LoginForm() {
  const { login } = useContext(Context);

  const [loginFormData, setLoginFormData] = useState({
    username_email: "",
    password: "",
    remember_me: false,
  });

  const [inCorrectInput, setInCorrectInput] = useState(true);

  const changeData = (event) => {
    const { id, value, type, checked } = event.target;
    setLoginFormData(() => ({
      ...loginFormData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const loginUser = (event) => {
    event.preventDefault();
    setLoginFormData((p) => ({
      ...p,
      password: bcrypt.hashSync(p.password, "$2a$10$CwTycUXWue0Thq9StjUM0u"),
    }));
    fetch(`/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormData),
    })
      .then((response) => response.json())
      .then((data) =>
        data.correct_input || data.auth
          ? (window.location.href = "/")
          : setInCorrectInput(true)
      );
    login();
  };

  return (
    <div className="login_wrapper">
      <h1 className="title">Login</h1>
      <form className="login_form">
        <div>
          <input
            id="username_email"
            onChange={changeData}
            placeholder="Username or E-Mail"
            className={"input_box " + inCorrectInput}
            type="text"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-user"></i>
        </div>
        <div>
          <input
            id="password"
            onChange={changeData}
            placeholder="Password"
            className={"input_box " + inCorrectInput}
            type="password"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-lock"></i>
        </div>
        <div className="remember_message">
          <div className="remember_me">
            <input onClick={changeData} id="remember_me" type="checkbox" />
            <label htmlFor="remember_me">Remember Me</label>
          </div>
          {inCorrectInput ? null : (
            <p className="message">Username or passwort is not correct!</p>
          )}
        </div>
        <Button
          onClick={loginUser}
          className="login_btn"
          variant="light"
          size="xxl"
        >
          Submit
        </Button>
      </form>
      <p className="register">
        Don't have an account?
        <a className="signup" href="/register">
          Sign Up
        </a>
      </p>
    </div>
  );
}

export default LoginForm;
