import React, { useEffect } from "react";

function CountryRankingPage() {
  const [rankingData, setRankingData] = useState();

  useEffect(() => {
    fetch("country")
      .then((res) => res.json())
      .then((data) => setRankingData(data));
  });

  return <div></div>;
}

export default CountryRankingPage;
