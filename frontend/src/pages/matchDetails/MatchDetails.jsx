import React, { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MatchDetailsHeading from "./components/MatchDetailsHeading";
import MatchLineups from "./components/MatchLineups";
import MatchDetailsInfo from "./components/MatchDetailsInfo";

export const MatchDetailsContext = createContext();

function MatchDetails() {
  const url = useLocation();
  const match_id = url.pathname.slice(15);

  const [match, setMatch] = useState({});
  const [statistics, setStatistics] = useState({});
  const [lineups, setLineups] = useState();

  useEffect(() => {
    fetch(`/api/match_details/${match_id}`)
      .then((res) => res.json())
      .then((res) => {
        setMatch(res.data.match);
        setStatistics(res.data.statistics);
        setLineups(res.data.lineups);
        console.log(res.data);
      });
  }, [match_id]);

  return (
    <div className="match_details">
      <MatchDetailsContext.Provider
        value={{ match, statistics, lineups }}
        className="match_detials"
      >
        <MatchDetailsHeading />
        <MatchDetailsInfo />
        <MatchLineups />
      </MatchDetailsContext.Provider>
    </div>
  );
}

export default MatchDetails;
