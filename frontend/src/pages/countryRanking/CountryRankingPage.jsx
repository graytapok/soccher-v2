import React from "react";
import Header from "./components/Header";
import Ranking from "./components/Ranking";
import "./styles/CountryRanking.css";

function CountryRankingPage() {
  return (
    <div className="ranking">
      <Header />
      <Ranking />
    </div>
  );
}

export default CountryRankingPage;
