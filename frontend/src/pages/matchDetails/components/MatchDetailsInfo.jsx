import React from "react";
import styled from "styled-components";

const MatchDetailsInfoComponent = styled.div`
  & {
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background-color: var(--navbar_color);
    border: 2px solid var(--border_light);
    border-radius: 30px;

    padding: 20px;
    margin: 20px;

    color: white;
  }

  .title {
  }
`;

function MatchDetailsInfo() {
  return <MatchDetailsInfoComponent>Hello</MatchDetailsInfoComponent>;
}

export default MatchDetailsInfo;
