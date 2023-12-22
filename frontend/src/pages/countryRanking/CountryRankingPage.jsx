import React, { useState, useEffect } from "react";
import Ranking from "../../components/Ranking";
import Heading from "../../components/Heading";

function CountryRankingPage() {
  const [rankingData, setRankingData] = useState({});

  useEffect(() => {
    fetch("/countrys_ranking")
      .then((res) => res.json())
      .then((data) => setRankingData(data.countrys));
  }, []);

  return (
    <div className="ranking">
      <Heading
        img={{ path: "images/leagues/fifa/fifa.png", alt: "FIFA" }}
        title="National Team Ranking"
      />
      <Ranking
        head={{
          0: { name: "Rank", atribute: "rank", sortable: true },
          1: {
            name: "Name",
            atribute: "name",
            sortable: true,
            background: ["color"],
            img: "images/countryFlags",
          },
          2: { name: "Points", atribute: "points", sortable: false },
          3: {
            name: "Previous Points",
            atribute: "prev_points",
            sortable: false,
          },
          4: {
            name: "+/-",
            atribute: "diff_points",
            sortable: true,
            coloredNumber: true,
          },
          5: {
            name: "Position",
            atribute: "diff_ranking",
            sortable: true,
            coloredNumber: true,
          },
        }}
        sorting={{ by: "rank", order: "desc" }}
        tbody={rankingData}
      />
    </div>
  );
}

export default CountryRankingPage;
