import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { LoginContext } from "../LoginPage";

const ConfirmEmailComponent = styled.div`
  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: var(--navbar_color);
    padding: 50px;
    width: 500px;
    min-height: 300px;
    min-width: 350px;
    max-width: 50%;

    border: 2px solid var(--border_light);
    border-radius: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    color: white;
  }

  .title {
    text-align: center;
    color: white;
    font-size: 40px;
    margin: 0px;
    margin-bottom: 20px;
    padding: 0px;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    flex-direction: column;
    background-color: var(--hover_color_2);
  }
`;

function ConfirmEmail() {
  const { userLogin } = useContext(LoginContext);
  useEffect(() => {
    fetch(`/auth/resend_email/${userLogin}`);
  }, [userLogin]);
  return (
    <ConfirmEmailComponent>
      <h1 className="title">Email Confirmation</h1>
      <div>
        <span>After the registration you didn't confirm your email.</span>
        <span>You recieved a new email. Please confirm it!</span>
      </div>
    </ConfirmEmailComponent>
  );
}

export default ConfirmEmail;
