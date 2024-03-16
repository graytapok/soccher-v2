import React, { useContext } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";

const LeaguesComponent = styled.div`
  .leagues {
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 400px;
    margin: 25px;
    padding: 20px;
    border: 2px solid var(--border_light);
    border-radius: 5px;
    background-color: var(--navbar_color);
    color: #fff;
  }

  .leagues .topping {
    padding: 10px;
    margin: 0;
    color: #fff;
    font-weight: normal;
    user-select: none;
  }

  .leagues .topping:hover {
    cursor: pointer;
  }

  .leagues .league {
    display: flex;
    color: rgba(255, 255, 255, 0.8);
    margin: 0px;
    margin-top: 10px;
    padding: 5px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    transition: all 0.3s;
  }

  .leagues .league:hover {
    border-color: var(--hover_bg_color);
    color: #fff;
  }

  .leagues .league i {
    color: rgba(255, 255, 255, 0.8);
    margin: auto 10px auto 10px;
    transition: all 0.3s;
  }

  .leagues .league i:hover {
    color: white;
    cursor: pointer;
    text-shadow: 0px 0px 10px #fff;
  }

  .leagues .league .topping {
    font-size: 22px;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s;
  }

  .leagues .league:hover {
    .topping {
      color: #fff;
    }
  }

  .leagues .league .league_logo {
    background-color: white;
    padding: 3px;
    border-radius: 3px;
    width: 30px;
    margin: auto 0 auto 5px;
  }

  .leagues .league .message {
    padding: 5px;
  }

  .leagues .league .loader {
    margin: 10px auto 10px auto;
  }
`;

function Leagues({ leagues, title, message, loading }) {
  const { followLeague, unFollowLeague, followedLeagues } = useContext(Context);
  const navigate = useNavigate();

  const checkFollow = (id) => {
    for (let league in followedLeagues) {
      if (followedLeagues[league].leagueId === parseInt(id)) {
        return true;
      }
    }
    return false;
  };

  return (
    <LeaguesComponent>
      <div className="leagues">
        {title && <h3 className="topping">{title}</h3>}
        {Object.keys(leagues).length > 0 ? (
          Object.keys(leagues).map((league) => (
            <div className="league" key={league}>
              {checkFollow(leagues[league].id) ? (
                <i
                  className="fa-solid fa-star"
                  onClick={() => unFollowLeague(leagues[league].id)}
                />
              ) : (
                <i
                  className="fa-regular fa-star"
                  onClick={() => followLeague(leagues[league])}
                />
              )}
              <img
                src={`images/leagues/${leagues[league].slug}/logo.png`}
                alt={`${leagues[league].slug}`}
                className="league_logo"
              ></img>
              <span
                className="topping"
                onClick={() => navigate(`/league/${leagues[league].id}`)}
              >
                {leagues[league].name}
              </span>
            </div>
          ))
        ) : (
          <div className="league">
            {loading ? (
              <ClipLoader
                size={40}
                color="white"
                speedMultiplier={1}
                aria-label="Loading Spinner"
                data-testid="loader"
                className="loader"
              />
            ) : (
              <span className="message">{message}</span>
            )}
          </div>
        )}
      </div>
    </LeaguesComponent>
  );
}

export default Leagues;
