import React, { useContext } from "react";
import "../styles/FollowedMatches.css";
import { Context } from "../../../App";
import { useNavigate } from "react-router-dom";

function FollowedMatches() {
  const { user, follow_match } = useContext(Context);
  const navigate = useNavigate();

  const follow = (id) => {
    follow_match(id);
    navigate("/profile");
  };

  return (
    <div className="today">
      <h3 className="topping">Followed matches</h3>
      {Object.keys(user.followed_matches).length > 0 ? (
        Object.keys(user.followed_matches).map((id, i) => (
          <div className="match" key={id}>
            <i className="fa-solid fa-star" onClick={() => follow(id)} />
            <p
              className="teams"
              onClick={() => navigate("/match_details/" + id)}
            >
              <span className="time">{user.followed_matches[id].time}</span>
              {user.followed_matches[id].country ? (
                <>
                  <span className="home_team">
                    <img
                      src={`countryFlags/${user.followed_matches[id].home.img}`}
                      alt={`${user.followed_matches[id].home.name}`}
                    />
                    {user.followed_matches[id].home.name}
                  </span>
                  <span className="away_team">
                    <img
                      src={`countryFlags/${user.followed_matches[id].away.img}`}
                      alt={`${user.followed_matches[id].away.name}`}
                    />
                    {user.followed_matches[id].away.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="home_team">
                    {user.followed_matches[id].home}
                  </span>
                  <span className="away_team">
                    {user.followed_matches[id].away}
                  </span>
                </>
              )}
            </p>
          </div>
        ))
      ) : (
        <div className="match">
          <span className="message">
            Your followed matches will apear here!
          </span>
        </div>
      )}
    </div>
  );
}

export default FollowedMatches;
