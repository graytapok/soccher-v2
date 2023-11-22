import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Ranking() {
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
    <>
      <table className="ranking_table">
        <thead>
          <tr>
            <th id="rank" className="th-sort-asc">
              <span className="po">Rank</span>
              <>
                <i
                  style={{ color: "#fff" }}
                  className="fa-solid fa-down-long"
                ></i>
                <i className="fa-solid fa-up-long"></i>
              </>
            </th>
            <th>
              <span className="po">Name</span>
              <>
                <i className="fa-solid fa-down-long"></i>
                <i className="fa-solid fa-up-long"></i>
              </>
            </th>
            <th className="th-sort-desc">
              <span>Points</span>
            </th>
            <th className="th-sort-desc">
              <span>Previous Points</span>
            </th>
            <th className="th-sort-asc">
              <span className="po">+/-</span>
              <>
                <i className="fa-solid fa-down-long"></i>
                <i className="fa-solid fa-up-long"></i>
              </>
            </th>
            <th>
              <span>Position</span>
            </th>
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
                    src={`countryFlags/${rankingData[id].img}`}
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
    </>
  );
}

export default Ranking;
