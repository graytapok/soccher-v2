import React, { createContext, useEffect, useState } from "react";
import TodaysMatches from "./components/TodaysMatches";

export const IndexContext = createContext();

function IndexPage() {
  const [matchesData, setMatchesData] = useState({});

  useEffect(() => {
    fetch("/index")
      .then((res) => res.json())
      .then((data) => {
        setMatchesData(data.matches);
      });
  }, []);

  return (
    <IndexContext.Provider value={{ matchesData }}>
      {<TodaysMatches />}
    </IndexContext.Provider>
  );
}

export default IndexPage;
