import React, { useState, useContext } from "react";
import Button from "../../../components/Button";
import styled from "styled-components";
import { Context } from "../../../App";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const RegisterFormComponent = styled.div`
  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--navbar_color);
    padding: 50px;
    width: 500px;
    min-height: 500px;
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

  .register_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .register_form div {
    position: relative;
    margin-top: 20px;
  }

  .register_form div span {
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
`;

function RegisterForm() {
  const { login } = useContext(Context);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
          setLoading(false);
          setCorrectInput(data.data);
        }
      });
  };

  return (
    <RegisterFormComponent className="register_wrapper">
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
          {!loading ? (
            "Register"
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
      <p className="ques">
        You already have an account?
        <span className="login" onClick={() => navigate("/login")}>
          Sign In
        </span>
      </p>
    </RegisterFormComponent>
  );
}

export default RegisterForm;
