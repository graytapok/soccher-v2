import React, { useContext, useState } from "react";
import DropdownMenu from "./components/DropDownMenu";
import LogoutMenu from "./components/LogoutMenu";
import Button from "../Button";
import "./styles/Navbar.css";
import { Context } from "../../App";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <img src="images/react/favicon.ico" alt="logo" />
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
          <span onClick={() => navigate("/profile")}>Profile</span>
        </li>
      )}
      {user.auth && user.admin && (
        <li>
          <span onClick={() => navigate("/admin/dashboard")}>Dashboard</span>
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
  const { user, darkmode } = useContext(Context);
  const navigate = useNavigate();

  return (
    <ul className="nav_btns">
      <li>
        <Button
          size="nav_icon"
          variant={darkmode === "darkmode" ? "secondary" : "primary"}
          outline
        >
          <i id="drp_icon" className="fa-solid fa-magnifying-glass" />
        </Button>
      </li>
      <li>
        <Button
          onClick={() => {
            toggleDropdown();
          }}
          size="nav_icon"
          variant={darkmode === "darkmode" ? "secondary" : "primary"}
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

function Navbar() {
  const { darkmode } = useContext(Context);
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
    <>
      <header
        className={darkmode === "darkmode" ? "navbar" : "navbar_lightmode"}
      >
        <Logo />
        <Links />
        <Buttons
          showDropdown={showDropdown}
          showLogoutMenu={showLogoutMenu}
          toggleDropdown={toggleDropdown}
          toggleLogoutMenu={toggleLogoutMenu}
        />
      </header>
      <DropdownMenu
        showDropdown={showDropdown}
        showLogoutMenu={showLogoutMenu}
        toggleDropdown={toggleDropdown}
      />
      <LogoutMenu
        showLogoutMenu={showLogoutMenu}
        showDropdown={showDropdown}
        toggleLogoutMenu={toggleLogoutMenu}
      />
    </>
  );
}

export default Navbar;
