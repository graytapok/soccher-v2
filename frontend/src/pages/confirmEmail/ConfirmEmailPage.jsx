import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Heading from "../../components/Heading";
import styled from "styled-components";
import { Context } from "../../App";
import LoginForm from "../signIn/forms/LoginForm";

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
`;

function ConfirmEmailPage() {
  const { user } = useContext(Context);
  const url = useLocation();
  const token = url.pathname.slice(15);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user.auth) {
      fetch(`/confirm_email/${token}`)
        .then((res) => res.json())
        .then((res) => setMessage(res.message))
        .catch((e) => console.log(e));
    }
  }, [user.auth, token]);

  return (
    <>
      <Heading title="Email Confirmation"></Heading>
      {user.auth ? (
        <ConfirmEmailPageComponent>
          <div className="message">
            {message.includes("confirmed") ? (
              message === "already confirmed" ? (
                <h1 className="message">Your email is already confirmed!</h1>
              ) : (
                <>
                  <h1 className="message">Thanks {user.name}!</h1>
                  <span>Your email is now confirmed!</span>
                </>
              )
            ) : (
              <>
                {message === "expired" && (
                  <h1 className="message">
                    Your email-verification is expired!
                  </h1>
                )}
                {message === "not correct" && (
                  <h1 className="message">
                    Your email verification token is not correct!
                  </h1>
                )}
              </>
            )}
          </div>
        </ConfirmEmailPageComponent>
      ) : (
        <LoginForm navigate_to={`/confirm_email/${token}`} />
      )}
    </>
  );
}

export default ConfirmEmailPage;
