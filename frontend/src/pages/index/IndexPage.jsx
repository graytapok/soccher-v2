import React, { createContext, useEffect, useState } from "react";
import Matches from "../../components/Matches";
import LeaguesOverview from "./components/LeaguesOverview";

export const IndexContext = createContext();

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
      <Matches
        title="Today's most interesting matches"
        matches={matchesData}
        message="Macthes not Found"
        redirect="/"
      />

      {/* <LeaguesOverview leagues={leaguesData} /> */}
    </IndexContext.Provider>
  );
}

export default IndexPage;
