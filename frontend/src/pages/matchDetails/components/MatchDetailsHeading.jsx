import React, { useContext } from "react";
import "../styles/MatchDetails.css";
import Heading from "../../../components/Heading";
import { MatchDetailsContext } from "../MatchDetails";

function MatchDetailsHeading() {
  const { match } = useContext(MatchDetailsContext);
  return (
    <Heading className="heading">
      {Object.keys(match).length > 0 && (
        <>
          <div className="team">
            <h3
              style={{
                backgroundColor: `rgba(${match.teams.home.color[0]}, ${match.teams.home.color[1]}, ${match.teams.home.color[2]}, 0.5)`,
              }}
            >
              {match.teams.home.name}
            </h3>
          </div>
          <div className="time">
            <h3>{match.start_time.date}</h3>
            <h3>{match.start_time.time}</h3>
          </div>
          <div className="team">
            <h3
              style={{
                backgroundColor: `rgba(${match.teams.away.color[0]}, ${match.teams.away.color[1]}, ${match.teams.away.color[2]}, 0.5)`,
              }}
            >
              {match.teams.away.name}
            </h3>
          </div>
        </>
      )}
    </Heading>
    /* <Heading
      title={
        Object.keys(match).length > 0 && (
          <HeadingComponent>
            <div className="team">
              <span
                style={{
                  backgroundColor: `rgba(${match.teams.home.color[0]}, ${match.teams.home.color[1]}, ${match.teams.home.color[2]}, 0.5)`,
                }}
              >
                {match.teams.home.name}
              </span>
            </div>

            <div className="time">
              <span>{match.start_time.date}</span>
              <span>{match.start_time.time}</span>
            </div>

            <div className="team">
              <span
                style={{
                  backgroundColor: `rgba(${match.teams.away.color[0]}, ${match.teams.away.color[1]}, ${match.teams.away.color[2]}, 0.5)`,
                }}
              >
                {match.teams.away.name}
              </span>
            </div>
          </HeadingComponent>
        )
      }
    /> */
  );
}

export default MatchDetailsHeading;
