import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../../../../components/Button";
import ClipLoader from "react-spinners/ClipLoader";

import { ChangePasswordPageContext } from "../ChangePasswordPage";

const ChangePasswordFormComponent = styled.div`
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

  .change_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .change_form div {
    position: relative;
  }

  .change_form div span {
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

  #confirmPassword {
    position: relative;
    margin-top: 20px;
  }

  #confirm_icon {
    right: 13px;
    top: 37px;
  }

  .message {
    color: rgba(var(--danger), 0.7);
    margin-top: 10px;
  }
`;

function ChangePasswordForm({ token }) {
  const [loading, setLoading] = useState(false);

  const { setShow } = useContext(ChangePasswordPageContext);

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [correctInput, setCorrectInput] = useState({});

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const changeData = (event) => {
    const { id, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const changePassword = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`/api/auth/change_password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          setCorrectInput({});
          setShow("complete");
        } else if (res.message === "incorrect input") {
          setCorrectInput(res.data);
          setLoading(false);
        } else {
          setMessage(res.message);
          setLoading(false);
        }
      });
  };

  return (
    <ChangePasswordFormComponent className="forgot_wrapper">
      <h1 className="title">Change Password</h1>
      <i
        className="fa-solid fa-arrow-left go_back"
        onClick={() => navigate("/login")}
      ></i>
      <form className="change_form">
        <span className="text">
          To change your password please enter a new one!
        </span>
        <div>
          <input
            id="password"
            onChange={changeData}
            placeholder="Password"
            className={"input_box " + !("password" in correctInput)}
            type="password"
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-lock"></i>
          {"password" in correctInput && (
            <span>
              Ensure 8-unit password with letters, capitals and numbers.
            </span>
          )}
        </div>
        <div>
          <input
            id="confirmPassword"
            onChange={changeData}
            placeholder="Confirm password"
            className={"input_box " + !("confirmPassword" in correctInput)}
            type="password"
          />
          <i
            id="confirm_icon"
            style={{ color: "#fff" }}
            className="fa-solid fa-lock-open"
          ></i>
          {"confirmPassword" in correctInput && (
            <span>Confirm Password must be equal to password.</span>
          )}
        </div>
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
      {message !== "" && (
        <span className="message">
          {message === "token is expired"
            ? "Your email message is expired!"
            : "Your email message token is incorrect!"}
        </span>
      )}
    </ChangePasswordFormComponent>
  );
}
export default ChangePasswordForm;
