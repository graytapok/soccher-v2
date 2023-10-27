import React from "react";
import Button from "./Button";
import "./styles/Navbar.css";

function Navbar({ auth = false }) {
  console.log(auth);

  return (
    <header className="navbar">
      <div className="logo">
        {/* <img className="logo" src="images/favicon.ico" alt="logo"/> */}
        <span>ScrTracker</span>
      </div>
      <ul className="nav_links">
        <li>
          <a href="/index">Home</a>
        </li>
        {auth === true ? (
          <li>
            <a href="/">My Profile</a>
          </li>
        ) : null}
      </ul>
      <ul className="nav_btns right">
        {/* !!! Add a button component !!! */}
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
            <Button size="icon" variant="danger" outline>
              <i className="fa-solid fa-right-from-bracket"></i>
            </Button>
          </li>
        ) : (
          <Button size="icon" variant="success" outline>
            <i className="fa-solid fa-right-to-bracket"></i>
          </Button>
        )}
        <li>
          <div className="dropdown">
            <ul className="menu" id="dropdown_menu">
              <li>
                <a href="/">Settings</a>
              </li>
              <li>
                <a href="/">Darkmode</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
