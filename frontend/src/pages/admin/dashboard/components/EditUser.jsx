import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Button from "../../../../components/Button";
import ClipLoader from "react-spinners/ClipLoader";
import { AdminDashboardContext } from "../DashboardPage";

const EditUserComponent = styled.div`
  & {
    position: relative;
    background-color: var(--navbar_color);
    padding: 50px;
    width: 500px;
    min-width: 350px;
    max-width: 50%;
    min-height: 500px;
    border: 2px solid var(--border_light);
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fff;
    margin-top: 40px;
  }

  .title {
    text-align: center;
    color: white;
    font-size: 40px;
    margin: 0px;
    margin-bottom: 20px;
    padding: 0px;
  }

  .info_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .info_form div {
    position: relative;
    margin-top: 20px;
  }

  .info_form div span {
    color: rgba(var(--danger), 0.7);
    font-size: 15px;
    margin-bottom: -10px;
  }

  .input_box {
    position: relative;
    padding: 0 20% 0 4%;
    width: 75.5%;
    height: 50px;
    font-size: 16px;
    background: transparent;
    outline: none;
    color: white;
    transition: all 0.3s ease 0s;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }

  .false {
    border-color: rgba(var(--danger), 0.7);
  }

  .input_box:focus,
  .input_box:hover {
    border-color: white;
    color: white;
  }

  .input_box::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  i {
    position: absolute;
    top: 19px;
    right: 18px;
    z-index: 1;
  }

  .radio_fields {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 0;
    padding: 0;
    div {
      display: flex;
      flex-direction: row;
      margin: 0;
    }
  }

  .radio_fields div label {
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    gap: 6px;
    font-size: 17px;
    transition: all 0.3s ease 0s;
    color: rgba(255, 255, 255, 0.3);
    user-select: none;
  }

  .radio_fields div label:hover {
    color: rgba(255, 255, 255, 1);
  }

  #email_icon {
    right: 17px;
  }

  #confirm_icon {
    right: 13px;
  }

  .submit_btn {
    margin-top: 20px;
  }

  .close {
    right: 30px;
    top: 30px;
    fontsize: 25px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    padding: 8px;
  }

  .close:hover {
    color: #fff;
  }
`;

function EditUser() {
  const { toggleEditUser, editedUser } = useContext(AdminDashboardContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [correctInput, setCorrectInput] = useState({
    username: { unique: true, rules: true },
    email: { unique: true, rules: true },
    password: true,
    confirm_password: true,
  });

  const editUser = (event) => {
    console.log(formData.id);
    setLoading(true);
    event.preventDefault();
    fetch(`/admin/edit/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.correct_input) {
          toggleEditUser();
        } else {
          setLoading(false);
          setCorrectInput(res.data);
        }
      });
  };

  const changeData = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    setLoading(false);
    setFormData({
      id: editedUser.id,
      username: editedUser.username,
      admin: editedUser.admin,
      email: editedUser.email,
      email_confirmed: editedUser.email_confirmed,
    });
  }, [editedUser]);

  return (
    <EditUserComponent>
      <h1 className="title">Edit User {editedUser.id}</h1>
      <i class="fa-solid fa-xmark close" onClick={() => toggleEditUser()}></i>
      <form className="info_form">
        <div>
          <input
            id="username"
            onChange={changeData}
            placeholder={"Name: " + editedUser.username}
            type="text"
            className={
              "input_box " +
              correctInput.username.unique +
              " " +
              correctInput.username.rules
            }
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-user"></i>
          {!correctInput.username.rules ? (
            <span>Username must be at least 3 letters long.</span>
          ) : !correctInput.username.unique ? (
            <span>User with this username already exists.</span>
          ) : null}
        </div>
        <div>
          <input
            id="email"
            onChange={changeData}
            placeholder={"Email: " + editedUser.email}
            type="text"
            className={
              "input_box " +
              correctInput.email.unique +
              " " +
              correctInput.email.rules
            }
          />
          <i
            id="email_icon"
            style={{ color: "#fff" }}
            className="fa-solid fa-envelope"
          />
          {!correctInput.email.rules ? (
            <span>Email must be valid.</span>
          ) : !correctInput.email.unique ? (
            <span>User with this email already exists.</span>
          ) : null}
        </div>
        <div>
          <input
            id="password"
            onChange={changeData}
            placeholder="Password"
            type="password"
            className={"input_box " + correctInput.password}
          />
          <i style={{ color: "#fff" }} className="fa-solid fa-lock"></i>
          {!correctInput.password && (
            <span>
              Ensure 8-unit password with letters, capitals and numbers.
            </span>
          )}
        </div>
        <div>
          <input
            id="confirm_password"
            onChange={changeData}
            placeholder="Confirm password"
            type="password"
            className={"input_box " + correctInput.confirm_password}
          />
          <i
            id="confirm_icon"
            style={{ color: "#fff" }}
            className="fa-solid fa-lock-open"
          ></i>
          {!correctInput.confirm_password && (
            <span>Confirm Password must be equal to password.</span>
          )}
        </div>
        <div className="radio_fields">
          <div className="admin_input">
            <input
              id="admin"
              type="checkbox"
              defaultChecked={editedUser.admin}
              onChange={changeData}
            />
            <label htmlFor="admin">Admin</label>
          </div>
          <div className="email_confirmed_input">
            <input
              id="email_confirmed"
              type="checkbox"
              defaultChecked={editedUser.email_confirmed}
              onChange={changeData}
            />
            <label htmlFor="email_confirmed">Email Confirmed</label>
          </div>
        </div>
        <Button
          onClick={editUser}
          className="submit_btn"
          variant="light"
          size="xxl"
        >
          {!loading ? (
            "Save changes"
          ) : (
            <ClipLoader
              size={20}
              color={"black"}
              speedMultiplier={1}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
        </Button>
      </form>
    </EditUserComponent>
  );
}

export default EditUser;
