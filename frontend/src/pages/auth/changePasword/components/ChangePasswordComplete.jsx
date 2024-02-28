import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { Context } from "../../../../App";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";

const ChangePasswordCompleteComponent = styled.div`
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
    border-radius: 10px;
    flex-direction: column;
    background-color: var(--hover_color_2);
  }

  span {
    text-align: center;
  }

  button {
    margin-top: 20px;
  }
`;

function ChangePasswordComplete() {
  const { updateAuth } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => updateAuth(), [updateAuth]);

  return (
    <ChangePasswordCompleteComponent>
      <h1 className="title">Done!</h1>
      <div>
        <span>You changed your password!</span>
        <span>We recomend you to write your password down...</span>
      </div>
      <Button onClick={() => navigate("/")}>Home</Button>
    </ChangePasswordCompleteComponent>
  );
}

export default ChangePasswordComplete;
