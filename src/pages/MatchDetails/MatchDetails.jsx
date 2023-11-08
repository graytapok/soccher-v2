import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function MatchDetails() {
  const url = useLocation();
  const match_id = url.pathname.slice(15);
  useEffect(() => {
    fetch("/match_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ match_id: match_id }),
    });
  }, []);
  console.log(match_id);
  return <div></div>;
}

export default MatchDetails;
