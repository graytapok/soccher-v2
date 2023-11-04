import React, { useContext } from "react";
import "./styles/TodaysMatches.css";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

function FollowedMatches() {
  const { user, follow_match } = useContext(Context);
  const navigate = useNavigate();

  const follow = (id) => {
    follow_match(id);
    navigate("/my_profile");
  };

  return (
    <div className="today">
      <h3 className="topping">Today's most interesting mathes</h3>
      {user.followed_matches ? (
        user.followed_matches.length >= 1 ? (
          [...user.followed_matches].map((id) => (
            <div className="match" key={id}>
              <i className="fa-solid fa-star" onClick={() => follow(id)} />
              <p
                className="teams"
                onClick={() => navigate("/match_details/" + id)}
              >
                <span className="time">22:00</span>
                <span className="home_team">{id}</span>
                <span className="away_team">Barcelona</span>
              </p>
            </div>
          ))
        ) : (
          <div className="match">
            <span className="message">
              Your followed matches will apear hear!
            </span>
          </div>
        )
      ) : (
        <div className="match">
          <span className="message">
            Your followed matches will apear hear!
          </span>
        </div>
      )}
    </div>
  );
}

export default FollowedMatches;
