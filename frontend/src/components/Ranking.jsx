import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RankingComponent = styled.div`
  .ranking_table .heading {
    display: flex;
    background-color: var(--heading_color);
    margin: 0;
    height: 150px;
    color: #fff;
    padding: 0 10% 0 10%;
    align-items: center;
    justify-content: center;
  }

  .ranking_table .heading img {
    height: 50px;
    margin-right: 20px;
  }

  .ranking_table {
    width: 900px;
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
  }

  .ranking_table .arrows {
    width: 30px;
  }

  .ranking_table th .po {
    cursor: pointer;
    margin-right: 5px;
  }

  .ranking_table th i {
    color: rgba(255, 255, 255, 0.5);
  }

  .ranking_table tbody tr:hover {
    background-color: rgba(var(--secondary), 0.5);
  }

  .ranking_table .td_item {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .ranking_table #diff {
    justify-content: space-evenly;
  }

  .ranking_table .country {
    user-select: none;
    color: #fff;
  }

  .ranking_table .item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ranking_table .country a {
    padding: 15px;
    border-radius: 5px;
    margin: auto 0 auto 0;
    cursor: pointer;
    user-select: none;
    text-decoration: none;
  }

  .ranking_table .country .country_icon {
    padding-right: 5px;
    padding-top: 2px;
    width: 20px;
    height: 12.5px;
  }
`;

const Ranking = ({ head, body }) => {
  /* 
  
  head = {
    1: {name: "blalalala", sortable: true, asc: "asc"}, 
    2: {name: "jojojojo", sortable: true, asc: "desc"},
    3: {name: "wawdsdasd", sortable: false, asc: null}
  }

  */
  const navigate = useNavigate();

  const [rankingData, setRankingData] = useState({});

  useEffect(() => {
    fetch("/countrys_ranking")
      .then((res) => res.json())
      .then((data) => setRankingData(data.countrys));
  }, []);

  /**
   *
   * @param {HTMLTableElement} table the table to sort
   * @param {number} column column to sort
   * @param {boolean} asc sorting increasing or decreasing
   */
  function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each Row
    const sortedRows = rows.sort((a, b) => {
      let aColTest = a
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();
      let bColTest = b
        .querySelector(`td:nth-child(${column + 1})`)
        .textContent.trim();

      switch (column) {
        case 1:
          return aColTest > bColTest ? 1 * dirModifier : -1 * dirModifier;
        case 0:
        case 4:
          return parseFloat(aColTest) > parseFloat(bColTest)
            ? 1 * dirModifier
            : -1 * dirModifier;
        default:
          break;
      }
    });

    // Remove all existing Trs from the table
    while (tBody.firstChild) {
      tBody.removeChild(tBody.firstChild);
    }

    // Read the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table
      .querySelectorAll("th")
      .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table
      .querySelector(`th:nth-child(${column + 1})`)
      .classList.toggle("th-sort-asc", asc);
    table
      .querySelector(`th:nth-child(${column + 1})`)
      .classList.toggle("th-sort-desc", !asc);
  }

  document.querySelectorAll(".ranking_table th").forEach((headerCell) => {
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(
        headerCell.parentElement.children,
        headerCell
      );
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");
      console.log(headerIndex, currentIsAscending);

      if (
        headerIndex !== 5 &&
        headerIndex !== 3 &&
        headerIndex !== 2 &&
        currentIsAscending
      ) {
        document.querySelectorAll(".fa-up-long").forEach((arrow) => {
          arrow.style.color = "rgba(255, 255, 255, .5)";
        });
        document.querySelectorAll(".fa-down-long").forEach((arrow) => {
          arrow.style.color = "rgba(255, 255, 255, .5)";
        });
        headerCell.querySelectorAll(".fa-up-long").forEach((arrow) => {
          arrow.style.color = "rgb(255, 255, 255)";
        });
      } else if (
        headerIndex !== 5 &&
        headerIndex !== 3 &&
        headerIndex !== 2 &&
        !currentIsAscending
      ) {
        document.querySelectorAll(".fa-up-long").forEach((arrow) => {
          arrow.style.color = "rgba(255, 255, 255, .5)";
        });
        document.querySelectorAll(".fa-down-long").forEach((arrow) => {
          arrow.style.color = "rgba(255, 255, 255, .5)";
        });
        headerCell.querySelectorAll(".fa-down-long").forEach((arrow) => {
          arrow.style.color = "rgb(255, 255, 255)";
        });
      }

      switch (headerIndex) {
        case 0:
        case 1:
        case 4:
          sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
          break;
        default:
          break;
      }
    });
  });

  return (
    <RankingComponent>
      <table className="ranking_table">
        <thead>
          <tr>
            {Object.keys(head).map((i) => (
              <th
                id="rank"
                className={
                  head[i].sortable && `th-sort-${head[i].asc ? "asc" : "desc"}`
                }
                key={1}
              >
                <span className="po">{head[i].name}</span>
                {head[i].sortable && (
                  <>
                    <i
                      style={{ color: "#fff" }}
                      className="fa-solid fa-down-long"
                    ></i>
                    <i className="fa-solid fa-up-long"></i>
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(rankingData).map((id) => (
            <tr>
              <td>
                <span className="td_item">{id}</span>
              </td>

              <td>
                <div
                  id={`${id} ${rankingData[id].name}`}
                  onClick={() => navigate(`/country/${id})`)}
                  className="item country"
                  style={{
                    backgroundColor: `rgba(${rankingData[id].color_primary[0]}, ${rankingData[id].color_primary[1]}, ${rankingData[id].color_primary[2]}, 0.5)`,
                    color: "#fff",
                  }}
                >
                  <img
                    src={`images/countryFlags/${rankingData[id].img}`}
                    alt={`${rankingData[id].name}`}
                    className="country_icon"
                  />
                  {rankingData[id].name}
                </div>
              </td>

              <td>
                <span className="td_item">{rankingData[id].points}</span>
              </td>

              <td>
                <span className="td_item">{rankingData[id].prev_points}</span>
              </td>

              <td>
                {rankingData[id].points > rankingData[id].prev_points ? (
                  <span
                    id="diff_points"
                    className="td_item"
                    style={{ color: "rgb(var(--success))" }}
                  >
                    {rankingData[id].diff_points}
                  </span>
                ) : rankingData[id].points < rankingData[id].prev_points ? (
                  <span
                    id="diff_points"
                    className="td_item"
                    style={{ color: "rgb(var(--danger))" }}
                  >
                    {rankingData[id].diff_points}
                  </span>
                ) : (
                  <span
                    id="diff_points"
                    className="td_item"
                    style={{ color: "rgba(var(--secondary))" }}
                  >
                    {rankingData[id].diff_points}
                  </span>
                )}
              </td>

              <td id="diff" className="td_item">
                {id > rankingData[id].prev_ranking ? (
                  <>
                    <i className="fa-solid fa-arrow-down"></i>
                    <span
                      id="diff_ranking"
                      style={{ color: "rgb(var(--danger))" }}
                    >
                      {rankingData[id].diff_ranking}
                    </span>
                  </>
                ) : id < rankingData[id].prev_ranking ? (
                  <>
                    <i className="fa-solid fa-arrow-up"></i>
                    <span
                      id="diff_ranking"
                      style={{ color: "rgb(var(--success))" }}
                    >
                      {rankingData[id].diff_ranking}
                    </span>
                  </>
                ) : (
                  <i
                    className="fa-solid fa-equals"
                    style={{ color: "rgba(255, 255, 255, .5)" }}
                  ></i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RankingComponent>
  );
};

export default Ranking;
