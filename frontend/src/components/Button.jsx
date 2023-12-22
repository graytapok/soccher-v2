import React from "react";
import styled from "styled-components";

const ButtonComponent = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  color: #fff;
  border-radius: var(--radius);
  transition: all 0.3s;
  ${(props) =>
    props.size === "nav_icon" || props.size === "icon"
      ? "padding: 10px; height: 60px; width: 60px; user-select: none;"
      : props.size === "mini"
      ? "padding: 0 1rem; height: 30px; font-size: 16px"
      : props.size === "sm"
      ? "padding: 0 1.5rem; height: 34px; font-size: 16px"
      : props.size === "mid"
      ? "padding: 0 1.8rem; height: 37px; font-size: 18px"
      : props.size === "lg"
      ? "padding: 0 2rem; height: 40px; font-size: 20px"
      : props.size === "xl"
      ? "padding: 0 2.3rem; height: 43px; font-size: 22px"
      : props.size === "xxl"
      ? "padding: 0 2.6rem; height: 46px; font-size: 24px"
      : console.log("Button: size")};
  background-color: rgba(var(--${(props) => props.variant}), 1);
  border: 2px solid rgba(
      ${(props) =>
        props.outline
          ? `var(--${props.variant})); background-color: var(--transparent); color: rgb(var(--${props.variant}))`
          : "var(--transparent))"};
  ${(props) => (props.variant === "light" ? "color: var(--navbar_color);" : "")}
  &:hover {
    background-color: ${(props) =>
      props.size === "nav_icon"
        ? `rgba(var(--primary), 1);`
        : `rgba(var(--${props.variant}), 1);`}
    border-color: ${(props) =>
      props.size === "nav_icon"
        ? `rgba(var(--primary), 1);`
        : `rgba(var(--${props.variant}), 1);`}
    box-shadow: 0 0 10px 1px ${(props) =>
      props.size === "nav_icon"
        ? `rgba(var(--primary), 1);`
        : `rgba(var(--${props.variant}), 1);`};
    ${(props) =>
      props.variant === "light" ? "color: black;" : "color: white;"}
    
  }
  ${(props) =>
    props.size === "nav_icon" || props.size === "icon"
      ? "i {font-size: 25px;}"
      : ""};
`;

function Button({
  type,
  variant,
  outline = false,
  id,
  className,
  onClick,
  size,
  children,
}) {
  return (
    <ButtonComponent
      type={type ? type : "button"}
      className={className ? `btn_component ${className}` : "btn_component"}
      id={id}
      onClick={onClick}
      size={size}
      variant={variant}
      outline={outline}
    >
      {children}
    </ButtonComponent>
  );
}

export default Button;
