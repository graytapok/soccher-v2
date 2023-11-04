import React, { useContext } from "react";
import "./styles/TodaysMatches.css";
import { IndexContext } from "../pages/IndexPage";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

function TodaysMatches() {
  const { user, follow_match } = useContext(Context);
  const { matchesData } = useContext(IndexContext);
  const navigate = useNavigate();

  const follow = (id) => {
    follow_match(id);
    navigate("/");
  };

  const checkInclude = (id) => {
    return user.followed_matches
      ? user.followed_matches.includes(Number(id))
      : false;
  };

  return (
    <div className="today">
      <h3 className="topping">Today's most interesting mathes</h3>
      {Object.keys(matchesData).map((id) => (
        <div className="match" key={id}>
          {checkInclude(id) ? (
            <i className="fa-solid fa-star" onClick={() => follow(id)} />
          ) : (
            <i className="fa-regular fa-star" onClick={() => follow(id)} />
          )}
          <p className="teams" onClick={() => navigate("/match_details/" + id)}>
            <span className="time">{matchesData[id].time}</span>
            <span className="home_team">{matchesData[id].home}</span>
            <span className="away_team">{matchesData[id].away}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default TodaysMatches;
