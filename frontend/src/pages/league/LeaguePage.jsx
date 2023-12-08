import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Ranking from "../../components/Ranking";
import styled from "styled-components";
import Heading from "../../components/Heading";

const LeagueComponent = styled.div``;

function LeaguePage() {
  const url = useLocation();
  const league_id = url.pathname.slice(8);

  const [standings, setStandings] = useState({});
  const [leagueInfo, setLeagueInfo] = useState({});

  useEffect(() => {
    fetch("/league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ league_id: league_id }),
    })
      .then((res) => res.json())
      .then((res) => {
        setStandings(res.standings);
        setLeagueInfo(res.league);
      });
  }, [league_id]);

  return (
    <LeagueComponent>
      <Heading
        img={{
          path: `/images/leagues/${leagueInfo.slug}/logo.png`,
          alt: leagueInfo.slug,
        }}
        title={leagueInfo.name}
      />
      <Ranking
        head={{
          0: {
            name: "Rank",
            atribute: "position",
            sortable: true,
          },
          1: {
            name: "Team",
            atribute: "name",
            sortable: true,
            background: ["team", "colors", "primary"],
          },
          2: { name: "Points", atribute: "points" },
          3: { name: "Wins", atribute: "wins" },
          4: { name: "Draws", atribute: "draws" },
          5: { name: "Losses", atribute: "losses" },
          6: { name: "Goals", atribute: "scored", sortable: true },
          7: { name: "Against Goals", atribute: "recieved" },
          8: {
            name: "Goals 𐤃",
            atribute: "diff",
            sortable: true,
            coloredNumber: true,
          },
        }}
        sorting={{ by: "position", order: "desc" }}
        tbody={standings}
      />
    </LeagueComponent>
  );
}

export default LeaguePage;
