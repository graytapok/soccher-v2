import React, { useContext } from "react";
import "../styles/MatchDetails.css";
import Heading from "../../../components/Heading";
import { MatchDetailsContext } from "../MatchDetails";
import styled from "styled-components";

const MatchDetailsHeadingComponent = styled.div`
  & {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .team,
  .time {
    height: 120px;
    width: 200px;

    h3 {
      margin: 0;
      padding: 0;
    }
  }
`;

function MatchDetailsHeading() {
  const { match } = useContext(MatchDetailsContext);
  return (
    <Heading className="heading">
      {Object.keys(match).length > 0 && (
        <MatchDetailsHeadingComponent>
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
            <h3>{match.startTime.date}</h3>
            <h3>{match.startTime.time}</h3>
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
        </MatchDetailsHeadingComponent>
      )}
    </Heading>
  );
}

export default MatchDetailsHeading;
