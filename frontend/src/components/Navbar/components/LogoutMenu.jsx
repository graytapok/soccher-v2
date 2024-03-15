import React, { useContext } from "react";
import Button from "../../Button";
import "../styles/LogoutMenu.css";
import { Context } from "../../../App";
import { useNavigate } from "react-router-dom";

const LogoutMenu = ({ showLogoutMenu, showDropdown, toggleLogoutMenu }) => {
  const { logout, darkmode } = useContext(Context);
  const navigate = useNavigate();

  const style = {
    marginTop: showLogoutMenu ? "0px" : "-100px",
    zIndex: showDropdown ? "-1" : "998",
  };

  const logoutUser = () => {
    fetch(`/api/auth/logout`)
      .then((response) => response.json())
      .then((res) => navigate("/"));
    logout();
    toggleLogoutMenu();
  };

  return (
    <div
      style={style}
      className={darkmode === "darkmode" ? "logout" : "logout_lightmode"}
    >
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

export default LogoutMenu;
