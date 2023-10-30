import React, { forceUpdate } from "react";
import Button from "./Button";
import "./styles/Navbar.css";
import { AuthData } from "../navigation/AuthWrapper";
import useAuth from "../hooks/useAuth";
import { Route } from "react-router-dom";
import { nav } from "../navigation/navigation";

const Logo = () => {
  return (
    <div className="logo">
      <img src="images/favicon.ico" alt="logo" />
      <span>Soccher</span>
    </div>
  );
};

const Links = ({ auth }) => {
  /* const { user } = AuthData();  */
  return (
    <ul className="nav_links">
      <li>
        <a href="/">Home</a>
      </li>
      {auth === true ? (
        <li>
          <a href="/my_profile">My Profile</a>
        </li>
      ) : null}
    </ul>
  );
};

const Buttons = ({ auth }) => {
  // const { user, logout } = AuthData();
  const logout = () => {
    fetch(`/logout`, { method: "GET" })
      .then((response) => response.json())
      .then((res) =>
        res.logged_out ? (window.location.href = "/") : console.log("Error")
      );
  };
  return (
    <ul className="nav_btns">
      <li>
        <Button size="nav_icon" variant="secondary" outline>
          <i id="drp_icon" className="fa-solid fa-magnifying-glass" />
        </Button>
      </li>
      <li>
        <Button size="nav_icon" variant="secondary" outline>
          <i id="drp_icon" className="fa-solid fa-bars" />
        </Button>
      </li>
      {auth === true ? (
        <li>
          <Button size="icon" variant="danger" onClick={logout} outline>
            <i className="fa-solid fa-right-from-bracket"></i>
          </Button>
        </li>
      ) : (
        <Button
          size="icon"
          variant="success"
          onClick={() => (window.location.href = "/login")}
          outline
        >
          <i className="fa-solid fa-right-to-bracket"></i>
        </Button>
      )}
    </ul>
  );
};

const Dropdown = () => {};

function Navbar() {
  const auth = useAuth();
  return (
    <header className="navbar">
      <Logo />
      <Links auth={auth} />
      <Buttons auth={auth} />
    </header>
  );
}

export default Navbar;
