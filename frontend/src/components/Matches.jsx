import React, { useContext } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MatchesComponent = styled.div`
  .matches {
    display: flex;
    flex-direction: column;
    width: 800px;
    margin: 25px;
    padding: 20px;
    border: 2px solid var(--border_light);
    border-radius: 5px;
    background-color: var(--navbar_color);
  }

  .matches .topping {
    padding: 10px;
    margin: 0;
    color: #fff;
    font-weight: normal;
  }

  .matches .match {
    display: flex;
    color: rgba(255, 255, 255, 0.8);
    margin: 0px;
    margin-top: 10px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    transition: all 0.3s;
  }

  .matches .match:hover {
    border-color: var(--hover_bg_color);
    color: #fff;
  }

  .matches .match .message {
    padding: 10px;
  }

  .matches .match i {
    color: rgba(255, 255, 255, 0.8);
    margin: auto 0px auto 20px;
    transition: all 0.3s;
  }

  .matches .match i:hover {
    color: white;
    cursor: pointer;
    text-shadow: 0px 0px 10px #fff;
  }

  .matches .match .time {
    display: flex;
    justify-content: center;
    margin: auto 15px auto 15px;
    width: 150px;
  }

  .matches .match .apostr {
    animation: apostr 1s infinite linear;
  }

  .matches .match .teams {
    display: flex;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.8);
    width: 100%;
    margin: 0;
  }

  .matches .match .teams .home_team,
  .matches .match .teams .away_team {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 5px;
  }

  .matches .match .teams img {
    width: 20px;
    height: 13px;
    margin-right: 7px;
  }

  .matches .match .teams .score {
    margin: 0 10px 0 auto;
  }

  @keyframes apostr {
    10%,
    20%,
    30%,
    40%,
    50% {
      opacity: 0;
    }
    60%,
    70%,
    80%,
    90%,
    100% {
      opacity: 1;
    }
  }
`;

function Matches({ title, matches, message }) {
  const { followMatch, unFollowMatch, followedMatches } = useContext(Context);
  const navigate = useNavigate();

  const checkFollow = (id) => {
    for (let match in followedMatches) {
      if (followedMatches[match].matchId === id) {
        return true;
      }
    }
    return false;
  };

  const statusList = ["finished", "canceled", "postponed"];

  return (
    <MatchesComponent>
      <div className="matches">
        {title && <h3 className="topping">{title}</h3>}
        {Object.keys(matches).length > 0 ? (
          Object.keys(matches).map((id) => (
            <div className="match" key={id}>
              {checkFollow(matches[id].id) ? (
                <i
                  className="fa-solid fa-star"
                  onClick={() => unFollowMatch(matches[id].id)}
                />
              ) : (
                <i
                  className="fa-regular fa-star"
                  onClick={() => followMatch(matches[id])}
                />
              )}
              <span
                className="time"
                style={
                  matches[id].status === "finished"
                    ? { color: "rgb(var(--danger))" }
                    : matches[id].status === "canceled" ||
                      matches[id].status === "postponed"
                    ? { color: "rgba(var(--warning))" }
                    : matches[id].status === "notstarted"
                    ? { color: "rgba(255, 255, 255, 0.8)" }
                    : { color: "rgb(var(--success))" }
                }
              >
                {matches[id].status !== "notstarted"
                  ? matches[id].currentTime
                  : matches[id].startTime}
                {!(
                  statusList.includes(matches[id].status) ||
                  matches[id].status === "notstarted"
                ) &&
                  matches[id].currentTime !== "Halftime" && (
                    <span className="apostr">'</span>
                  )}
              </span>

              <p
                className="teams"
                onClick={() => navigate("/match_details/" + matches[id].id)}
              >
                <div className="home_team">
                  {matches[id].country && (
                    <img
                      src={`/images/countryFlags/${matches[id].home.img}`}
                      alt={`${matches[id].home}`}
                    />
                  )}
                  <span>{matches[id].home.name}</span>
                  <span
                    className="score"
                    style={
                      matches[id].status === "inprogress"
                        ? { color: "rgb(var(--success))" }
                        : matches[id].status === "finished"
                        ? { color: "rgb(var(--danger))" }
                        : { color: "rgba(255, 255, 255, 0.8)" }
                    }
                  >
                    {matches[id].home.score}
                  </span>
                </div>

                <div className="away_team">
                  {matches[id].country && (
                    <img
                      src={`/images/countryFlags/${matches[id].away.img}`}
                      alt={`${matches[id].away}`}
                    />
                  )}
                  <span>{matches[id].away.name}</span>
                  <span
                    className="score"
                    style={
                      matches[id].status === "inprogress"
                        ? { color: "rgb(var(--success))" }
                        : matches[id].status === "finished"
                        ? { color: "rgb(var(--danger))" }
                        : { color: "rgba(255, 255, 255, 0.8)" }
                    }
                  >
                    {matches[id].away.score}
                  </span>
                </div>
              </p>
            </div>
          ))
        ) : (
          <>
            <div className="match">
              <span className="message">{message}</span>
            </div>
          </>
        )}
      </div>
    </MatchesComponent>
  );
}

export default Matches;
