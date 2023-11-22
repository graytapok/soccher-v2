import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MatchesComponent = styled.div`
  .matches {
    display: flex;
    flex-direction: column;
    width: 40%;
    min-width: 400px;
    margin: 25px;
    padding: 20px;
    border: 2px solid var(--border_light);
    border-radius: 5px;
    background-color: var(--navbar_color);
    z-index: 3;
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

  .matches .match .message {
    padding: 10px;
  }

  .matches .match:hover {
    border-color: var(--hover_bg_color);
    color: #fff;
  }

  .matches .match .teams {
    display: flex;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.8);
    width: 100%;
    margin: 0;
  }

  .matches .match i {
    color: rgba(255, 255, 255, 0.8);
    position: absolute;
    margin-top: 27px;
    left: 58px;
    transition: all 0.3s;
  }

  .matches .match i:hover {
    color: white;
    cursor: pointer;
    text-shadow: 0px 0px 10px #fff;
  }

  .matches .match .teams .time {
    position: absolute;
    display: flex;
    justify-content: center;
    left: 100px;
    width: 52px;
    padding-top: 24px;
  }

  .matches .match .teams .home_team,
  .matches .match .teams .away_team {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 5px;
    margin: 0 0 0 120px;
  }

  .matches .match .teams img {
    width: 20px;
    height: 13px;
    margin-right: 7px;
  }

  .matches .match .teams .score {
    margin: 0 10px 0 auto;
  }

  .matches .match .teams .apostr {
    animation: apostr 1s infinite linear;
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

function Matches({ title, matches, message, redirect }) {
  const { followedMatches, follow_match } = useContext(Context);
  const navigate = useNavigate();

  console.log(followedMatches);

  const follow = (id) => {
    follow_match(id, matches[id]);
    navigate(redirect);
  };

  const checkInclude = (id) => {
    return followedMatches ? Number(id) in followedMatches : false;
  };

  return (
    <MatchesComponent>
      <div className="matches">
        <h3 className="topping">{title}</h3>
        {Object.keys(matches).length > 0 ? (
          Object.keys(matches).map((id) => (
            <div className="match" key={id}>
              {checkInclude(id) ? (
                <i className="fa-solid fa-star" onClick={() => follow(id)} />
              ) : (
                <i className="fa-regular fa-star" onClick={() => follow(id)} />
              )}

              <p
                className="teams"
                onClick={() => navigate("/match_details/" + id)}
              >
                {matches[id].status === "notstarted" ? (
                  <span className="time">{matches[id].start_time}</span>
                ) : matches[id].status === "finished" ? (
                  <span className="time" style={{ color: "#fff" }}>
                    {matches[id].start_time}
                  </span>
                ) : (
                  <span
                    className="time"
                    style={{ color: "rgb(var(--danger))" }}
                  >
                    {matches[id].current_time}
                    <span className="apostr">'</span>
                  </span>
                )}

                <div className="home_team">
                  {matches[id].country && (
                    <img
                      src={`countryFlags/${matches[id].home.img}`}
                      alt={`${matches[id].home}`}
                    />
                  )}
                  <span>{matches[id].home.name}</span>
                  <span
                    className="score"
                    style={
                      matches[id].status === "inprogress"
                        ? { color: "rgb(var(--danger))" }
                        : matches[id].status === "finished"
                        ? { color: "#fff" }
                        : null
                    }
                  >
                    {matches[id].home.score}
                  </span>
                </div>

                <div className="away_team">
                  {matches[id].country && (
                    <img
                      src={`countryFlags/${matches[id].away.img}`}
                      alt={`${matches[id].away}`}
                    />
                  )}
                  <span>{matches[id].away.name}</span>
                  <span
                    className="score"
                    style={
                      matches[id].status === "inprogress"
                        ? { color: "rgb(var(--danger))" }
                        : null
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
