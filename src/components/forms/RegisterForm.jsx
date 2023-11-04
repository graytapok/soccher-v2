import React, { useState, useContext } from "react";
import Button from "../Button";
import { Context } from "../../App";
import "./styles/RegisterForm.css";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const { login } = useContext(Context);
  const navigate = useNavigate();

  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [correctInput, setCorrectInput] = useState({
    username: { unique: true, rules: true },
    email: { unique: true, rules: true },
    password: true,
    confirm_password: true,
  });

  const changeData = (event) => {
    const { id, value, type, checked } = event.target;
    setSignupFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const createUser = (event) => {
    event.preventDefault();
    fetch(`/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.correct_input) {
          setCorrectInput({
            username: true,
            email: true,
            password: true,
            confirm_password: true,
          });
          login();
          navigate("/");
        } else {
          setCorrectInput(data.data);
        }
      });
  };

  return (
    <div className="register_wrapper">
      <h1 className="title">Signup</h1>
      <form className="register_form">
        <div>
          <input
            id="username"
            onChange={changeData}
            placeholder="Username"
            className={
              "input_box " +
              correctInput.username.unique +
              " " +
              correctInput.username.rules
            }
            type="text"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-user"></i>
          {!correctInput.username.rules ? (
            <span>Username must be at least 3 letters long.</span>
          ) : !correctInput.username.unique ? (
            <span>User with this username already exists.</span>
          ) : null}
        </div>
        <div style={{ marginTop: !correctInput.username ? "10px" : "20px" }}>
          <input
            id="email"
            onChange={changeData}
            placeholder="E-Mail"
            className={
              "input_box " +
              correctInput.email.unique +
              " " +
              correctInput.email.rules
            }
            type="text"
          />
          <i
            id="email_icon"
            style={{ color: "#fff" }}
            className="fa-solid fa-envelope"
          />
          {!correctInput.email.rules ? (
            <span>Email must be valid.</span>
          ) : !correctInput.email.unique ? (
            <span>User with this email already exists.</span>
          ) : null}
        </div>
        <div style={{ marginTop: !correctInput.email ? "10px" : "20px" }}>
          <input
            id="password"
            onChange={changeData}
            placeholder="Password"
            className={"input_box " + correctInput.password}
            type="password"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-lock"></i>
          {!correctInput.password && (
            <span>
              Ensure 8-unit password with letters, capitals and numbers.
            </span>
          )}
        </div>
        <div style={{ marginTop: !correctInput.password ? "10px" : "20px" }}>
          <input
            id="confirm_password"
            onChange={changeData}
            placeholder="Confirm password"
            className={"input_box " + correctInput.confirm_password}
            type="password"
          />
          <i
            id="confirm_icon"
            style={{ color: "#fff" }}
            className="fa-solid fa-lock-open"
          ></i>
          {!correctInput.confirm_password && (
            <span>Confirm Password must be equal to password.</span>
          )}
        </div>
        <Button
          onClick={createUser}
          className="submit_btn"
          variant="light"
          size="xxl"
          style={{
            marginTop: !correctInput.confirm_password ? "10px" : "20px",
          }}
        >
          Submit
        </Button>
      </form>
      <p className="ques">
        You already have an account?
        <span className="login" onClick={() => navigate("/login")}>
          Log In
        </span>
      </p>
    </div>
  );
}

export default RegisterForm;
