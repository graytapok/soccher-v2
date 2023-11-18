import React, { useContext } from "react";
import "../styles/TodaysMatches.css";
import { IndexContext } from "../IndexPage";
import { Context } from "../../../App";
import { useNavigate } from "react-router-dom";

function TodaysMatches() {
  const { user, follow_match } = useContext(Context);
  const { matchesData } = useContext(IndexContext);
  const navigate = useNavigate();

  const follow = (id) => {
    follow_match(id, matchesData[id]);
    navigate("/");
  };

  const checkInclude = (id) => {
    return user.followed_matches ? Number(id) in user.followed_matches : false;
  };

  return (
    <div className="today">
      <h3 className="topping">Today's most interesting matches</h3>
      {Object.keys(matchesData).map((id) => (
        <div className="match" key={id}>
          {checkInclude(id) ? (
            <i className="fa-solid fa-star" onClick={() => follow(id)} />
          ) : (
            <i className="fa-regular fa-star" onClick={() => follow(id)} />
          )}
          <p className="teams" onClick={() => navigate("/match_details/" + id)}>
            <span className="time">{matchesData[id].time}</span>
            {matchesData[id].country ? (
              <>
                <div className="home_team">
                  <img
                    src={`countryFlags/${matchesData[id].home.img}`}
                    alt={`${matchesData[id].home}`}
                  />
                  <span>{matchesData[id].home.name}</span>
                  <span className="score">{matchesData[id].home.score}</span>
                </div>
                <div className="away_team">
                  <img
                    src={`countryFlags/${matchesData[id].away.img}`}
                    alt={`${matchesData[id].home}`}
                  />
                  <span>{matchesData[id].away.name}</span>
                  <span className="score">{matchesData[id].away.score}</span>
                </div>
              </>
            ) : (
              <>
                <div className="home_team">
                  <span className="score">{matchesData[id].home}</span>
                </div>
                <div className="away_team">
                  <span className="score">{matchesData[id].away}</span>
                </div>
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TodaysMatches;
