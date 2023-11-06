import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodaysMatches from "./components/TodaysMatches";
import { Context } from "../../App";

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
