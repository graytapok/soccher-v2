import React, { useContext } from "react";
import "./styles/TodaysMatches.css";
import { IndexContext } from "../pages/IndexPage";
import { useNavigate } from "react-router-dom";

function TodaysMatches() {
  const { matchesData, follow_match, followedMatches } =
    useContext(IndexContext);

  const navigate = useNavigate();

  const checkInclude = (val) => {
    return followedMatches.includes(Number(val));
  };

  return (
    <div className="today">
      <h3 className="topping">Today's most interesting mathes</h3>
      {Object.keys(matchesData).map((id) => (
        <div className="match" key={id}>
          {checkInclude(id) ? (
            <i className="fa-solid fa-star" onClick={() => follow_match(id)} />
          ) : (
            <i
              className="fa-regular fa-star"
              onClick={() => follow_match(id)}
            />
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
