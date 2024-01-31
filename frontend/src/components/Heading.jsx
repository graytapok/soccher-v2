import React from "react";
import styled from "styled-components";

const HeadingComponent = styled.div`
  & {
    display: flex;
    flex-direction: column;
    background-color: var(--heading_color);
    margin: 0;
    height: 150px;
    color: #fff;
    padding: 20px;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  img {
    height: 50px;
    margin-right: 20px;
    background-color: white;
    padding: 10px;
    border-radius: 6px;
  }
`;

function Heading({ title, img, children }) {
  return (
    <HeadingComponent className="heading">
      {(img || title) && (
        <div>
          {img && <img src={img.path} alt={img.alt} />}
          {title && <h1>{title}</h1>}
        </div>
      )}
      {children}
    </HeadingComponent>
  );
}

export default Heading;
