import React, { createContext, useEffect, useState } from "react";
import Matches from "../../components/Matches";
import Leagues from "../../components/Leagues";
import styled from "styled-components";

export const IndexContext = createContext();

const IndexComponent = styled.div`
  .index {
    display: flex;
    z-index: 1;
    margin-left: 25px;
  }
`;

function IndexPage() {
  const [matchesData, setMatchesData] = useState({});
  const [leaguesData, setLeaguesData] = useState({});

  useEffect(() => {
    fetch("/index")
      .then((res) => res.json())
      .then((data) => {
        setMatchesData(data.matches);
        setLeaguesData(data.leagues);
      });
  }, []);

  return (
    <IndexContext.Provider value={{ matchesData, leaguesData }}>
      <IndexComponent>
        <div className="index">
          <Leagues
            leagues={leaguesData}
            message="Macthes not Found"
            title="Leagues"
            redirect="/"
          />
          <Matches
            title="Today's matches"
            matches={matchesData}
            message="Macthes not Found"
            redirect="/"
          />
        </div>
      </IndexComponent>
    </IndexContext.Provider>
  );
}

export default IndexPage;
