import React, { useContext, useEffect, useState } from "react";
import { MatchDetailsContext } from "../MatchDetails";
import styled from "styled-components";

const MatchLineupsComponent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
  margin-top: 20px;

  .field {
    position: relative;
  }

  img {
    min-height: 150px;
    min-width: 130px;
    max-width: 700px;
  }

  .message {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 180px;
    text-align: center;
    height: 20px;
    font-size: 25px;
    transform: translate(0, -150%);
  }
`;

const TeamComponent = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  ${(p) =>
    p.cords
      ? `height: ${(p.cords.bottom - p.cords.top) / 2}px; 
            width: ${p.cords.right - p.cords.left}px;`
      : null}
  ${(p) =>
    p.key === "away"
      ? "top: 0;"
      : `top: ${(p.cords.bottom - p.cords.top) / 2}px;`}
`;

const LayerComponent = styled.div`
  padding: 10px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const PlayerComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 110px;
  .number {
    width: 40px;
    height: 40px;
    line-height: 40px;
    ${(p) =>
      p.color.primary ? `background-color: #${p.color.primary};` : null}
    ${(p) =>
      p.color.outline ? `outline: 2px solid #${p.color.outline};` : null}
    ${(p) => (p.color.number ? `color: #${p.color.number};` : null)}
    ${(p) =>
      p.color.fancyNumber && p.position === "G"
        ? `color: #${p.color.fancyNumber};`
        : null}
    border-radius: 50%;
    text-align: center;
    margin-bottom: 3px;
  }
  .name {
    font-size: 17px;
    background-color: var(--navbar_color);
    color: white;
    padding: 3px;
    border-radius: 5px;
  }
`;

function MatchLineups() {
  const { lineups } = useContext(MatchDetailsContext);
  const [layers, setLayers] = useState({});

  useEffect(() => {
    if (lineups != null) {
      let allLayers = { home: [], away: [] };
      for (const team of ["home", "away"]) {
        let counter = 1;
        for (const layer of lineups.teams[team].formation.split("-")) {
          let curLayer = [];
          for (let i = 0; i < layer; i++) {
            curLayer.push(lineups.teams[team].players[counter + i]);
          }
          allLayers[team].push(curLayer.reverse());
          counter += parseInt(layer);
        }
      }
      setLayers(allLayers);
    }
  }, [lineups]);

  return (
    <MatchLineupsComponent>
      <div className="field" id="field">
        <img src="\images\pages\matchDetails\field.png" alt="field" />
        {lineups != null &&
        Object.keys(layers).length > 0 &&
        Object.keys(lineups).length > 0 ? (
          Object.keys(lineups.teams).map((team) => (
            <TeamComponent
              className="team"
              id={team}
              key={team}
              cords={document.getElementById("field").getBoundingClientRect()}
              style={
                team === "away"
                  ? { top: "0" }
                  : {
                      top: `${Math.ceil(
                        (document
                          .getElementById("field")
                          .getBoundingClientRect().bottom -
                          document
                            .getElementById("field")
                            .getBoundingClientRect().top) /
                          2
                      )}px`,
                      flexDirection: "column-reverse",
                    }
              }
            >
              <LayerComponent
                style={
                  team === "away"
                    ? { marginTop: "30px" }
                    : { marginBottom: "30px" }
                }
              >
                <PlayerComponent
                  team={team}
                  color={lineups.teams[team].goalkeeper}
                  position={lineups.teams[team].players[0].position}
                >
                  <div className="number">
                    {lineups.teams[team].players[0].number}
                  </div>
                  <span className="name">
                    {lineups.teams[team].players[0].name}
                  </span>
                </PlayerComponent>
              </LayerComponent>
              {layers[team].map((layer) => (
                <LayerComponent key={layers[team].indexOf(layer) + team}>
                  {Object.keys(layer).map((player) => (
                    <PlayerComponent
                      key={layer[player].id}
                      team={team}
                      color={lineups.teams[team].player}
                    >
                      <div className="number">{layer[player].number}</div>
                      <span className="name">{layer[player].name}</span>
                    </PlayerComponent>
                  ))}
                </LayerComponent>
              ))}
            </TeamComponent>
          ))
        ) : (
          <span className="message">No lineups for this game...</span>
        )}
      </div>
    </MatchLineupsComponent>
  );
}

export default MatchLineups;
