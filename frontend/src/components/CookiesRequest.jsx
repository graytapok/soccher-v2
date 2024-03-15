import React, { useContext } from "react";
import styled from "styled-components";
import Button from "./Button";
import { Context } from "../App";

const CookiesRequestComponent = styled.div`
  position: sticky;
  bottom: 20px;
  margin: 0 20px 20px auto;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 500px;

  background-color: var(--navbar_color);
  border-radius: var(--radius);
  color: #fff;

  h1 {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  p {
    display: flex;
    text-align: center;
    margin-top: 0;
  }

  div {
    display: flex;
    text-align: center;
    margin: 0 auto 20px auto;
    gap: 20px;
  }
`;

function CookiesRequest() {
  const { toggleCookiesRequest, darkmode } = useContext(Context);

  const cookies = () => {
    fetch("/api/cookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ darkmode: darkmode }),
    })
      .then((res) => res.json())
      .then((data) =>
        data.cookies === false ? console.log("error") : toggleCookiesRequest()
      );
  };

  return (
    <CookiesRequestComponent>
      <h1>
        <span>Cookies</span>
      </h1>
      <p>
        Our web application is using cookies! For better experience you should
        accept them!
      </p>
      <div>
        <Button
          variant="danger"
          size="xxl"
          onClick={() => toggleCookiesRequest()}
        >
          Regret
        </Button>
        <Button variant="success" size="xxl" onClick={() => cookies()}>
          Accept
        </Button>
      </div>
    </CookiesRequestComponent>
  );
}

export default CookiesRequest;
