import React, { useEffect, useState, createContext } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import EditUser from "./EditUser";

const AdminTableComponent = styled.div`
  .ranking_table {
    width: 1200px;
    margin: 20px auto 0 auto;
    color: #fff;
    background-color: var(--navbar_color);
    padding: 10px;
  }

  .ranking_table th {
    justify-content: space-between;
    margin: 10px;
    text-align: left;
    user-select: none;
    font-size: 15px;
    padding-left: 5px;
  }

  .ranking_table th .po {
    margin-right: 5px;
  }

  .ranking_table th i {
    color: rgba(255, 255, 255, 0.5);
  }

  .ranking_table tbody tr:hover {
    .td_item {
      background-color: rgba(var(--secondary), 0.5);
    }
  }

  .ranking_table .td_item {
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  .ranking_table .td_item .td_item_img {
    padding-right: 5px;
    width: 20px;
    height: 12.5px;
  }
`;

const InfoComponent = styled.div`
  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    z-index: -1;
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

const TdItemComponent = styled.span`
  ${(p) =>
    p.head[p.j].coloredNumber
      ? p.body[p.i][p.head[p.j].atribute] > 0
        ? { color: "rgb(var(--success))" }
        : p.body[p.i][p.head[p.j].atribute] === 0
        ? { color: "rgb(var(--secondary))" }
        : { color: "rgb(var(--danger))" }
      : null}
  ${(p) =>
    p.background_colors
      ? {
          backgroundColor: `rgb(${p.background_colors[0]}, ${p.background_colors[1]}, ${p.background_colors[2]}, 0.5)`,
        }
      : null}
`;

export const AdminTableContext = createContext();

const AdminTable = ({ head, tbody, sorting, settings }) => {
  /* 
  
  head={
    0: { 
      name: "Rank", 
      atribute: "position", --where to get info from api
      sortable: true,
      img: --path-to-folder--,
      background: ["color-folder"] }
  }

  sorting={by: atribute, order: "asc"}

  tbody=[{...}, {...}, {...}, ...]

  */

  const [body, setBody] = useState(tbody);

  const [curColumn, setCurColumn] = useState(sorting.by);
  const [order, setOrder] = useState(sorting.order);

  const [showInfo, setShowInfo] = useState(false);
  const [curUser, setCurUser] = useState({});
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(false);

  const [correctInput, setCorrectInput] = useState({
    username: { unique: true, rules: true },
    email: { unique: true, rules: true },
    password: true,
    confirm_password: true,
  });

  const sortByColumn = (col) => {
    if (curColumn !== col) {
      setCurColumn(col);
      const sorted = [...body].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setBody(sorted);
      setOrder("desc");
    } else if (order === "asc") {
      const sorted = [...body].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setBody(sorted);
      setOrder("desc");
    } else if (order === "desc") {
      const sorted = [...body].sort((a, b) => (a[col] < b[col] ? 1 : -1));
      setBody(sorted);
      setOrder("asc");
    }
  };

  const findValue = (obj, array) => {
    if (array) {
      let cur = obj[array[0]];
      let new_array = [...array];
      while (new_array.length > 0 && obj) {
        cur = obj[new_array[0]];
        obj = cur;
        new_array.shift();
      }
      return cur;
    }
  };

  const findLastAtribute = (obj, array) => {
    if (array.length > 1) {
      let cur = obj[array[0]];
      let new_array = [...array];
      while (new_array.length > 1 && obj) {
        cur = obj[new_array[0]];
        obj = cur;
        new_array.shift();
      }
      return cur;
    }
  };

  const deleteItem = (id) => {
    fetch(`${settings.delete}/${id}`)
      .then((res) => res.json())
      .then((d) =>
        d.message === "deleted"
          ? fetch(settings.update)
              .then((res) => res.json())
              .then((r) => setBody(r[settings.data]))
          : console.log(d.message)
      );
  };

  const toggleUserInfo = (user = null) => {
    setShowInfo((prev) => !prev);
    if (user) {
      setCurUser(user);
      setFormData({
        id: user.id,
        username: user.username,
        admin: user.admin,
        email: user.email,
        email_confirmed: user.email_confirmed,
      });
    }
    setCorrectInput({
      username: { unique: true, rules: true },
      email: { unique: true, rules: true },
      password: true,
      confirm_password: true,
    });
  };

  useEffect(() => {
    setBody(tbody);
    setShowInfo(false);
    setLoading(false);
    setCorrectInput({
      username: { unique: true, rules: true },
      email: { unique: true, rules: true },
      password: true,
      confirm_password: true,
    });
  }, [tbody]);

  const changeData = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const updateBody = () => {
    fetch(settings.update)
      .then((res1) => res1.json())
      .then((r1) => setBody(r1[settings.data]));
  };

  return (
    <AdminTableContext.Provider
      value={{
        showInfo,
        setBody,
        updateBody,
        toggleUserInfo,
        formData,
        changeData,
        curUser,
      }}
    >
      <AdminTableComponent>
        {!showInfo ? (
          <table className="ranking_table">
            <thead>
              <tr>
                <th>
                  <span className="po" style={{ cursor: "auto" }}>
                    Settings
                  </span>
                </th>
                {Object.keys(head).map((i) => (
                  <th key={i}>
                    <span
                      className="po"
                      style={
                        head[i].sortable
                          ? { cursor: "pointer" }
                          : { cursor: "auto" }
                      }
                      onClick={
                        head[i].sortable
                          ? () => {
                              Array.isArray(head[i].atribute)
                                ? findLastAtribute(body[i], head[i].atribute)
                                : sortByColumn(head[i].atribute);
                            }
                          : null
                      }
                    >
                      {head[i].name}
                    </span>
                    {head[i].sortable && (
                      <>
                        <i
                          className="fa-solid fa-down-long"
                          style={
                            curColumn === head[i].atribute
                              ? order === "desc"
                                ? { color: "#fff" }
                                : null
                              : null
                          }
                        ></i>
                        <i
                          className="fa-solid fa-up-long"
                          style={
                            curColumn === head[i].atribute
                              ? order === "asc"
                                ? { color: "#fff" }
                                : null
                              : null
                          }
                        ></i>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body &&
                Object.keys(body).map((i) => (
                  <tr key={i}>
                    <td
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <Button
                        size="mini"
                        variant="primary"
                        onClick={() => toggleUserInfo(body[i])}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </Button>
                      <Button
                        size="mini"
                        variant="danger"
                        onClick={() => deleteItem(body[i].id)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </Button>
                    </td>
                    {Object.keys(head).map((j) => (
                      <td key={j}>
                        <TdItemComponent
                          className="td_item"
                          head={head}
                          body={body}
                          j={j}
                          i={i}
                          background_colors={
                            head[j].background
                              ? findValue(body[i], head[j].background)
                              : null
                          }
                        >
                          {head[j].img ? (
                            <img
                              className="td_item_img"
                              src={`${head[j].img}/${body[i].img}`}
                              alt="img"
                            />
                          ) : null}

                          {Array.isArray(head[j].atribute) ? (
                            findValue(body[i], head[j].atribute)
                          ) : typeof body[i][head[j].atribute] === "boolean" ? (
                            body[i][head[j].atribute] ? (
                              <i
                                style={{ color: "rgb(var(--success))" }}
                                class="fa-solid fa-check"
                              ></i>
                            ) : (
                              <i
                                style={{ color: "rgb(var(--danger))" }}
                                class="fa-solid fa-xmark"
                              ></i>
                            )
                          ) : (
                            body[i][head[j].atribute]
                          )}
                        </TdItemComponent>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <EditUser />
        )}
      </AdminTableComponent>
    </AdminTableContext.Provider>
  );
};

export default AdminTable;
