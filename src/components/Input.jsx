import styled from "styled-components";

const InputComponent = styled.input`
  padding-left: 20px;
  outline: none;
  color: white;
  transition: all 0.3s ease 0s;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius);
  background-color: transparent;
  ${(props) =>
    props.variant === "light"
      ? "color: #fff; border: 2px solid rgb(var(--secondary));"
      : props.variant === "dark"
      ? "color: var(--navbar_color); border: 2px solid rgba(var(--secondary), .5);"
      : props.variant === "lg"
      ? ""
      : props.variant === "xl"
      ? ""
      : props.variant === "xxl"
      ? ""
      : console.log("Input: variant")}
  ${(props) =>
    props.size === "sm"
      ? "padding: 5px; height: 20px; font-size: 16px;"
      : props.size === "mid"
      ? "padding: 5px; height: 25px; font-size: 18px;"
      : props.size === "lg"
      ? "padding: 5px; height: 30px; font-size: 20px;"
      : props.size === "xl"
      ? "padding: 5px; height: 35px; font-size: 22px;"
      : props.size === "xxl"
      ? "padding: 5px; height: 40px; font-size: 24px;"
      : console.log("Input: size")}
  :focus,
  :hover {
    border-color: white;
    color: white;
  }
`;

const Input = ({ type = "text", children, size, variant }) => {
  return (
    <InputComponent type={type} size={size} variant={variant}>
      {children}
    </InputComponent>
  );
};

export default Input;
