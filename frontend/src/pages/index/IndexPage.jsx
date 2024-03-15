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
  const [matchesData, setMatchesData] = useState([]);
  const [leaguesData, setLeaguesData] = useState([]);

  useEffect(() => {
    fetch("/api/index")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setMatchesData(res.data.matches);
          setLeaguesData(res.data.leagues);
        } else {
          console.log(res.message);
        }
      });
  }, []);

  return (
    <IndexContext.Provider value={{ matchesData, leaguesData }}>
      <IndexComponent>
        <div className="index">
          <Leagues
            leagues={leaguesData}
            message="Leagues not Found"
            title="Leagues"
          />
          <Matches
            title="Today's matches"
            matches={matchesData}
            message="Matches not Found"
          />
        </div>
      </IndexComponent>
    </IndexContext.Provider>
  );
}

export default IndexPage;
