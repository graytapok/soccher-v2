import React from "react";
import styled from "styled-components";

const HeadingComponent = styled.div`
  & {
    display: flex;
    background-color: var(--heading_color);
    margin: 0;
    height: 150px;
    color: #fff;
    padding: 0 10% 0 10%;
    align-items: center;
    justify-content: center;
  }

  img {
    height: 50px;
    margin-right: 20px;
    background-color: white;
    padding: 10px;
    border-radius: 6px;
  }
`;

function Heading({ title, img }) {
  return (
    <HeadingComponent className="heading">
      <img src={img.path} alt={img.alt} />
      <h1>{title}</h1>
    </HeadingComponent>
  );
}

export default Heading;
