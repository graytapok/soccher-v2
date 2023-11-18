import React, { useContext } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MatchesComponent = styled.div`
  .matches {
    display: flex;
    flex-direction: column;
    width: 30%;
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
    left: 100px;
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
`;

function Matches({ title, matches, message }) {
  const { user, follow_match } = useContext(Context);
  const navigate = useNavigate();

  const follow = (id) => {
    follow_match(id, matches[id]);
    navigate("/");
  };

  const checkInclude = (id) => {
    return user.followed_matches ? Number(id) in user.followed_matches : false;
  };

  return (
    <MatchesComponent className="matches">
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
              <span className="time">{matches[id].time}</span>
              {matches[id].country ? (
                <>
                  <div className="home_team">
                    <img
                      src={`countryFlags/${matches[id].home.img}`}
                      alt={`${matches[id].home}`}
                    />
                    <span>{matches[id].home.name}</span>
                    <span className="score">{matches[id].home.score}</span>
                  </div>
                  <div className="away_team">
                    <img
                      src={`countryFlags/${matches[id].away.img}`}
                      alt={`${matches[id].home}`}
                    />
                    <span>{matches[id].away.name}</span>
                    <span className="score">{matches[id].away.score}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="home_team">
                    <span className="score">{matches[id].home}</span>
                  </div>
                  <div className="away_team">
                    <span className="score">{matches[id].away}</span>
                  </div>
                </>
              )}
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
    </MatchesComponent>
  );
}

export default Matches;
