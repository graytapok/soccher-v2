import React, { useContext, useState } from "react";
import Button from "./Button";
import "./styles/Navbar.css";
import useAuth from "../hooks/useAuth";
import { Context } from "../App";
import { redirect } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <img src="images/favicon.ico" alt="logo" />
      <span>Soccher</span>
    </div>
  );
};

const Links = () => {
  const { user } = useContext(Context);
  return (
    <ul className="nav_links">
      <li>
        <span onClick={() => (window.location.href = "/")}>Home</span>
      </li>
      {user.auth === true ? (
        <li>
          <span onClick={() => (window.location.href = "/my_profile")}>
            My Profile
          </span>
        </li>
      ) : null}
    </ul>
  );
};

const Buttons = ({ showDropdown, toggleDropdown }) => {
  const { user, logout } = useContext(Context);
  return (
    <ul className="nav_btns">
      <li>
        <Button size="nav_icon" variant="secondary" outline>
          <i id="drp_icon" className="fa-solid fa-magnifying-glass" />
        </Button>
      </li>
      <li>
        <Button
          onClick={() => {
            toggleDropdown();
          }}
          size="nav_icon"
          variant="secondary"
          outline
        >
          {showDropdown ? (
            <i className="fa-regular fa-circle-xmark"></i>
          ) : (
            <i className="fa-solid fa-bars" />
          )}
        </Button>
      </li>
      {user.auth === true ? (
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

const DropdownMenu = ({ showDropdown }) => {
  const { darkMode, toggleDarkMode } = useContext(Context);
  const style = {
    display: showDropdown ? "block" : "none",
  };
  return (
    <div style={style} className="dropdown">
      <ul className="menu">
        <li>
          <a className="label" href="/settings">
            Settings
          </a>
          <i className="fa-solid fa-sliders" />
        </li>
        <li
          onClick={() => {
            toggleDarkMode();
          }}
        >
          <span className="label">{darkMode ? "Dark Mode" : "Light Mode"}</span>
          <i
            style={darkMode ? { transform: "scaleX(-1)" } : null}
            id="darkmode_icon"
            className="fa-solid fa-circle-half-stroke"
          />
        </li>
      </ul>
    </div>
  );
};

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };
  return (
    <header className="navbar">
      <Logo />
      <Links />
      <Buttons showDropdown={showDropdown} toggleDropdown={toggleDropdown} />
      <DropdownMenu showDropdown={showDropdown} />
    </header>
  );
}

export default Navbar;
