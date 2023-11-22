import React from "react";

function LeaguesOverview({ leagues }) {
  return (
    <div>
      {Object.keys(leagues).map((league) => (
        <span>{leagues[league].name}</span>
      ))}
    </div>
  );
}

export default LeaguesOverview;
