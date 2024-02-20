import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../../../components/Button";

const AdminTableComponent = styled.div`
  .ranking_table {
    margin: 20px auto 0 auto;
    color: #fff;
    background-color: var(--navbar_color);
    padding: 20px;
    padding-bottom: 15px;
  }

  .ranking_table th {
    text-align: left;
    user-select: none;
    font-size: 15px;
    padding-left: 5px;
    margin: 10px;
    min-width: 100px;
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
    margin: 5px;
  }

  .ranking_table .td_item .td_item_img {
    padding-right: 5px;
    width: 20px;
    height: 12.5px;
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

const AdminTable = ({ head, tbody, sorting, settings }) => {
  /* 
  
  head={
    0: { 
      name: "Rank", 
      atribute: "position", --where to get info from api
      sortable: true,
      img: --path-to-folder--,
      background: ["color-folder"],
      atribut_array: true
    }
  }

  sorting={by: atribute, order: "asc"}

  tbody=[{...}, {...}, {...}, ...]

  */

  const [body, setBody] = useState(tbody);

  const [curColumn, setCurColumn] = useState(sorting.by);
  const [order, setOrder] = useState(sorting.order);

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
    fetch(`${settings.delete}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((res) =>
        res.success
          ? setBody((prev) => prev.filter((el) => el.id !== id))
          : console.log(res.message)
      );
  };

  const convert_array = (arr) => {
    let ans = arr[0];
    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        ans = `${arr[i]}, ${ans}`;
      }
      return ans;
    }
    return arr[0];
  };

  useEffect(() => {
    setBody(tbody);
  }, [tbody]);

  return (
    <AdminTableComponent>
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
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Button
                    size="mini"
                    variant="primary"
                    onClick={() => settings.edit(body[i])}
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
                        head[j].atribute_array ? (
                          convert_array(findValue(body[i], head[j].atribute))
                        ) : (
                          findValue(body[i], head[j].atribute)
                        )
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
    </AdminTableComponent>
  );
};

export default AdminTable;
