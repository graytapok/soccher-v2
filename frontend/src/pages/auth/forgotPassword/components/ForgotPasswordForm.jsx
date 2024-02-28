import React, { useState, useContext } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Button from "../../../../components/Button";
import { ForgotPasswordPageContext } from "../ForgotPasswordPage";

const ForgotPasswordFormComponent = styled.div`
  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--navbar_color);
    padding: 80px 50px 80px 50px;
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

  .forgot_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .forgot_form div {
    position: relative;
  }

  .forgot_form div span {
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

  .submit_btn {
    margin-top: 20px;
  }

  i {
    position: absolute;
    top: 19px;
    right: 18px;
    z-index: -1;
  }

  .go_back {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 1;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }

  .go_back:hover {
    color: white;
  }

  .text {
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 20px 10px;
  }

  .message {
    color: rgba(var(--danger), 0.7);
    font-weight: normal;
    font-size: 17px;
    margin-top: 3px;
  }
`;

function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  const { setShow } = useContext(ForgotPasswordPageContext);

  const [loginData, setLoginData] = useState("");

  const [correctInput, setCorrectInput] = useState(true);

  const navigate = useNavigate();

  const changeData = (event) => {
    setLoginData(event.target.value);
  };

  const changePassword = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`/auth/forgot_password/${loginData}`)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          setCorrectInput(true);
          setShow("complete");
        } else {
          setCorrectInput(false);
          setLoading(false);
        }
      });
  };

  return (
    <ForgotPasswordFormComponent className="forgot_wrapper">
      <h1 className="title">Forgot Password</h1>
      <i
        className="fa-solid fa-arrow-left go_back"
        onClick={() => navigate("/login")}
      ></i>
      <form className="forgot_form">
        <span className="text">
          To change your password please enter your username or email!
        </span>
        <div>
          <input
            id="login"
            onChange={changeData}
            placeholder="Username or E-Mail"
            className={"input_box " + correctInput}
            type="text"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-user"></i>
        </div>
        {correctInput === false && (
          <span className="message">User was not found</span>
        )}
        <Button
          onClick={changePassword}
          className="submit_btn"
          variant="light"
          size="xxl"
        >
          {!loading ? (
            "Submit"
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
    </ForgotPasswordFormComponent>
  );
}

export default ForgotPasswordForm;
