import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";

import Button from "../../../../components/Button";
import { Context } from "../../../../App";
import { LoginContext } from "../LoginPage";

const LoginFormComponent = styled.div`
  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--navbar_color);
    padding: 50px;
    width: 500px;
    min-width: 350px;
    max-width: 50%;
    border: 2px solid var(--border_light);
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .title {
    text-align: center;
    color: white;
    font-size: 40px;
    margin: 0px;
    margin-bottom: 20px;
    padding: 0px;
  }

  .login_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .login_form div {
    position: relative;
  }

  .login_form div span {
    color: rgba(var(--danger), 0.7);
    font-size: 15px;
    margin-bottom: -10px;
  }

  .input_box {
    position: relative;
    padding: 0 20% 0 4%;
    width: 75.5%;
    height: 50px;
    font-size: 16px;
    background: transparent;
    outline: none;
    color: white;
    transition: all 0.3s ease 0s;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }

  .false {
    border-color: rgba(var(--danger), 0.7);
  }

  .input_box:focus,
  .input_box:hover {
    border-color: white;
    color: white;
  }

  .input_box::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  i {
    position: absolute;
    top: 19px;
    right: 18px;
    z-index: -1;
  }

  #email_icon {
    right: 17px;
  }

  #confirm_icon {
    right: 13px;
  }

  .submit_btn {
    margin-top: 20px;
  }

  .register {
    color: white;
    margin-top: 20px;
    justify-content: flex-end;
  }

  .ques {
    display: flex;
    justify-content: center;
    flex-direction: row;
    padding: 0px;
    font-size: 17px;
    color: #fff;
  }

  .login {
    position: relative;
    top: -3px;
    text-decoration: none;
    font-weight: bold;
    border: none;
    padding: 3px;
    padding-left: 7px;
    padding-right: 7px;
    transition: all 0.3s ease 0s;
    color: rgba(255, 255, 255, 0.5);
    font-size: 17px;
  }

  .login:hover {
    color: white;
    cursor: pointer;
  }

  .remember_message {
    display: flex;
    margin: 0;
    padding: 0;
    justify-content: space-between;
  }

  .remember_message .remember_me {
    display: flex;
    flex-direction: row;
    gap: 6px;
    font-size: 17px;
    transition: all 0.3s ease 0s;
    color: rgba(255, 255, 255, 0.3);
    margin: 17px 0 17px 0;
    user-select: none;
  }

  .signup,
  .remember_message .remember_me,
  .remember_message .remember_me > input,
  .remember_message .remember_me > label {
    cursor: pointer;
  }

  .remember_message .remember_me:hover {
    color: rgba(255, 255, 255, 1);
  }

  .message {
    color: rgba(var(--danger), 0.7);
    font-weight: normal;
    font-size: 17px;

    a {
      color: rgba(var(--danger), 0.9);
      text-decoration-line: underline;
      transition: all 0.3s ease 0s;
    }

    a:hover {
      color: white;
      text-decoration-line: underline;
    }
  }

  .register {
    font-size: 17px;
    display: flex;
    color: white;
    margin-top: 20px;
    justify-content: center;
    display: flex;
    flex-direction: row;
    padding: 0px;
    cursor: default;
  }

  .ques li {
    list-style-type: none;
    padding: 0px;
    margin: 0px;
  }

  .signup {
    font-size: 17px;
    position: relative;
    top: -3px;
    text-decoration: none;
    font-weight: bold;
    border: none;
    padding: 3px;
    padding-left: 7px;
    padding-right: 7px;
    transition: all 0.3s ease 0s;
    color: rgba(255, 255, 255, 0.5);
  }

  .signup:hover {
    color: white;
  }

  i {
    position: absolute;
    top: 19px;
    right: 18px;
    z-index: -1;
  }
`;

function LoginForm() {
  const [loading, setLoading] = useState(false);

  const { updateAuth } = useContext(Context);
  const { setShow, setUserLogin } = useContext(LoginContext);
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
          navigate("/");
        } else if (res.message === "email must be confirmed") {
          setLoading(false);
          setUserLogin(loginFormData.login);
          setShow("confirm");
        } else {
          setLoading(false);
          setCorrectInput(res.message);
        }
      });
  };

  return (
    <LoginFormComponent className="login_wrapper">
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
        <div style={{ marginTop: "20px" }}>
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
      <span className="signup" onClick={() => navigate("/forgot_password")}>
        Forgot password?
      </span>
    </LoginFormComponent>
  );
}

export default LoginForm;
