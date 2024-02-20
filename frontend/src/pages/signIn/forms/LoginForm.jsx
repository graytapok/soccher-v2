import React, { useState, useContext } from "react";
import Button from "../../../components/Button";
import { Context } from "../../../App";
import "../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function LoginForm({ navigate_to }) {
  const [loading, setLoading] = useState(false);

  const { updateAuth } = useContext(Context);
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({});

  const [correctInput, setCorrectInput] = useState("");

  const changeData = (event) => {
    const { id, value, type, checked } = event.target;
    setLoginFormData({
      ...loginFormData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const loginUser = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(loginFormData);
    fetch(`/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormData),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          setCorrectInput(true);
          updateAuth();
          navigate(navigate_to || "/");
        } else {
          setLoading(false);
          setCorrectInput(res.message);
        }
      });
  };

  return (
    <div className="login_wrapper">
      <h1 className="title">Login</h1>
      <form className="login_form">
        <div>
          <input
            id="login"
            onChange={changeData}
            placeholder="Username or E-Mail"
            className={"input_box " + (correctInput !== "incorrect input")}
            type="text"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-user"></i>
        </div>
        <div>
          <input
            id="password"
            onChange={changeData}
            placeholder="Password"
            className={"input_box " + (correctInput !== "incorrect input")}
            type="password"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-lock"></i>
        </div>
        <div className="remember_message">
          <div className="remember_me">
            <input onClick={changeData} id="rememberMe" type="checkbox" />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          {correctInput === "incorrect input" && (
            <p className="message">Invalid username/e-mail or passwort!</p>
          )}
          {correctInput === "email must be confirmed" && (
            <p className="message">You must confirm your email!</p>
          )}
        </div>
        <Button
          onClick={loginUser}
          className="login_btn"
          variant="light"
          size="xxl"
        >
          {!loading ? (
            "Log In"
          ) : (
            <ClipLoader
              size={20}
              color="black"
              speedMultiplier={1}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </Button>
      </form>
      <p className="register">
        Don't have an account?
        <span className="signup" onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default LoginForm;
