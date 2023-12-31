import { useNavigate } from "react-router-dom";
import { Context } from "../../../App";
import { useContext } from "react";
import "../styles/DropdownMenu.css";

const DropdownMenu = ({ showDropdown, showLogoutMenu, toggleDropdown }) => {
  const { darkmode, toggleDarkmode } = useContext(Context);
  const navigate = useNavigate();

  const style = {
    marginTop: showDropdown ? "57px" : "-53px",
    zIndex: showLogoutMenu ? "-1" : "998",
  };

  return (
    <div
      style={style}
      className={darkmode === "darkmode" ? "dropdown" : "dropdown_lightmode"}
    >
      <ul className="menu">
        <li
          onClick={() => {
            navigate("/settings");
            toggleDropdown();
          }}
        >
          <span className="label">Settings</span>
          <i className="fa-solid fa-sliders" />
        </li>
        <li
          onClick={() => {
            toggleDarkmode();
          }}
        >
          <span className="label">
            {darkmode === "darkmode" ? "Lightmode" : "Darkmode"}
          </span>
          <i
            style={darkmode === "lightmode" ? { marginRight: "4px" } : null}
            id="darkmode_icon"
            className={
              darkmode === "darkmode" ? "fa-solid fa-sun" : "fa-solid fa-moon"
            }
          />
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
