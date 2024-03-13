import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import Button from "../../components/Button";
import Ranking from "../../components/Ranking";
import Heading from "../../components/Heading";
import { Context } from "../../App";

const LeagueComponent = styled.div``;

function LeaguePage() {
  const url = useLocation();
  const league_id = url.pathname.slice(8);

  const { user } = useContext(Context);

  const [standings, setStandings] = useState({});
  const [leagueInfo, setLeagueInfo] = useState({});

  const updateStandings = () => {
    fetch(`/league/${league_id}`)
      .then((res) => res.json())
      .then((res) => {
        setStandings(res.data.standings);
        setLeagueInfo(res.data.league);
      });
  };

  useEffect(() => {
    updateStandings();
  }, [league_id]);

  const update = () => {
    fetch(`/soccer_api/league/${league_id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success == true) {
          updateStandings();
        }
      });
  };

  return (
    <LeagueComponent>
      <Heading
        img={{
          path: `/images/leagues/${leagueInfo.slug}/logo.png`,
          alt: leagueInfo.slug,
        }}
        title={leagueInfo.name}
      >
        {user.admin && <Button onClick={update}>Update</Button>}
      </Heading>
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
          3: { name: "Wins", atribute: "wins", sortable: true },
          4: { name: "Draws", atribute: "draws", sortable: true },
          5: { name: "Losses", atribute: "losses", sortable: true },
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
