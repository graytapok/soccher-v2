import React, { useContext } from "react";
import Button from "../../Button";
import "../styles/LogoutMenu.css";
import { Context } from "../../../App";
import { useNavigate } from "react-router-dom";

const LogoutMenu = ({ showLogoutMenu, showDropdown, toggleLogoutMenu }) => {
  const { logout } = useContext(Context);
  const navigate = useNavigate();

  const style = {
    marginTop: showLogoutMenu ? "0px" : "-100px",
    zIndex: showDropdown ? "-1" : "998",
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

export default LogoutMenu;
