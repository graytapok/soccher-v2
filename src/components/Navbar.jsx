import React, { useContext, useState } from "react";
import Button from "./Button";
import "./styles/Navbar.css";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <ul className="nav_links">
      <li>
        <span onClick={() => navigate("/")}>Home</span>
      </li>
      {user.auth && (
        <li>
          <span onClick={() => navigate("/my_profile")}>My Profile</span>
        </li>
      )}
      <li>
        <span onClick={() => navigate("/about")}>About</span>
      </li>
    </ul>
  );
};

const Buttons = ({
  showDropdown,
  showLogoutMenu,
  toggleDropdown,
  toggleLogoutMenu,
}) => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

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
          <Button
            size="icon"
            variant="danger"
            onClick={toggleLogoutMenu}
            outline
          >
            {showLogoutMenu ? (
              <i className="fa-regular fa-circle-xmark"></i>
            ) : (
              <i className="fa-solid fa-right-from-bracket"></i>
            )}
          </Button>
        </li>
      ) : (
        <Button
          size="icon"
          variant="success"
          onClick={() => navigate("/login")}
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
    marginTop: showDropdown ? "0px" : "-115px",
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

const LogoutMenu = ({ showLogoutMenu, toggleLogoutMenu }) => {
  const { logout } = useContext(Context);
  const navigate = useNavigate();

  const style = {
    marginTop: showLogoutMenu ? "0px" : "-100px",
  };

  const logoutUser = () => {
    fetch(`/logout`, { method: "GET" })
      .then((response) => response.json())
      .then((res) => (res.logged_out ? navigate("/") : console.log("Error")));
    logout();
    toggleLogoutMenu();
  };

  return (
    <div style={style} className="logout">
      <div className="logout_menu">
        <span>Log out?</span>
        <Button
          onClick={toggleLogoutMenu}
          className="logout_button"
          size="lg"
          variant="primary"
          outline
        >
          No
        </Button>
        <Button
          onClick={logoutUser}
          className="logout_button"
          size="lg"
          variant="danger"
          outline
        >
          Yes
        </Button>
      </div>
    </div>
  );
};

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const toggleDropdown = () => {
    if (showLogoutMenu) {
      setShowLogoutMenu((prevShow) => !prevShow);
      setShowDropdown((prevShowDropdown) => !prevShowDropdown);
    } else {
      setShowDropdown((prevShowDropdown) => !prevShowDropdown);
    }
  };

  const toggleLogoutMenu = () => {
    if (showDropdown) {
      setShowDropdown((prevShow) => !prevShow);
      setShowLogoutMenu((prevShow) => !prevShow);
    } else {
      setShowLogoutMenu((prevShow) => !prevShow);
    }
  };

  return (
    <header className="navbar">
      <Logo />
      <Links />
      <Buttons
        showDropdown={showDropdown}
        showLogoutMenu={showLogoutMenu}
        toggleDropdown={toggleDropdown}
        toggleLogoutMenu={toggleLogoutMenu}
      />
      <DropdownMenu showDropdown={showDropdown} />
      <LogoutMenu
        showLogoutMenu={showLogoutMenu}
        toggleLogoutMenu={toggleLogoutMenu}
      />
    </header>
  );
}

export default Navbar;
