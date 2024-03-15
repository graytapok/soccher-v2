import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useIsFirstRender } from "@uidotdev/usehooks";
import styled from "styled-components";

import Heading from "../../../components/Heading";
import { Context } from "../../../App";
import Button from "../../../components/Button";

const ConfirmEmailPageComponent = styled.div`
  & {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .message {
    color: #fff;
    background-color: var(--navbar_color);
    padding: 30px;
    margin: 30px;
    border-radius: 10px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .message h1 {
    margin: 5px;
    padding: 10px;
  }

  .message span {
    margin: 10px;
  }

  button {
    margin-top: 10px;
  }
`;

function ConfirmEmailPage() {
  const render = useIsFirstRender();

  const { user, updateAuth } = useContext(Context);
  const navigate = useNavigate();

  const url = useLocation();
  const token = url.pathname.slice(15);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (render) {
      fetch(`/api/auth/confirm_email/${token}`)
        .then((res) => res.json())
        .then((res) => {
          updateAuth();
          if (res.success) {
            setMessage("confirmed");
          } else {
            console.log(res);
            setMessage(res.message);
          }
        })
        .catch((e) => console.log(e));
    }
  }, [user.auth, token, updateAuth, render]);

  return (
    <>
      <Heading title="Email Confirmation"></Heading>
      <ConfirmEmailPageComponent>
        <div className="message">
          {message === "confirmed" ? (
            <>
              <h1 className="message">Thanks {user.name}!</h1>
              <span>Your email is now confirmed!</span>
              <Button onClick={() => navigate("/")}>Home</Button>
            </>
          ) : message === "token is expired" ? (
            <h1 className="message">Your email-verification is expired!</h1>
          ) : message === "already confirmed" ? (
            <Navigate to="/" replace />
          ) : (
            message === "token is incorrect" && (
              <h1 className="message">
                Your email verification token is not correct!
              </h1>
            )
          )}
        </div>
      </ConfirmEmailPageComponent>
    </>
  );
}

export default ConfirmEmailPage;
