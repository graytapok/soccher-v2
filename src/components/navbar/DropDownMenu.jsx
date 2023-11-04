import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { useContext } from "react";

const DropdownMenu = ({ showDropdown, toggleDropdown }) => {
  const { darkMode, toggleDarkMode } = useContext(Context);
  const navigate = useNavigate();
  const style = {
    marginTop: showDropdown ? "57px" : "-53px",
  };
  return (
    <div style={style} className="dropdown">
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

export default DropdownMenu;
