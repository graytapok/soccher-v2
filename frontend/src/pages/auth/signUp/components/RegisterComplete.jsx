import React from "react";
import styled from "styled-components";

const RegisterCompleteComponent = styled.div`
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
`;

function RegisterComplete() {
  return (
    <RegisterCompleteComponent>
      <h1 className="title">Thank you!</h1>
      <div>
        <span>One last step before you can use our platform...</span>
        <span>You recieved an email. Please confirm it!</span>
      </div>
    </RegisterCompleteComponent>
  );
}

export default RegisterComplete;
