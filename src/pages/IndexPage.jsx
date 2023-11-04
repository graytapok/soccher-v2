import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodaysMatches from "../components/TodaysMatches";

export const IndexContext = createContext();

function IndexPage() {
  const [matchesData, setMatchesData] = useState({});
  const [followedMatches, setFollowedMatches] = useState([]);
  const navigate = useNavigate();

  const addFollow = (val) => {
    return setFollowedMatches((prevMatches) => [...prevMatches, Number(val)]);
  };

  const deleteFollow = (val) => {
    setFollowedMatches((prevMatches) =>
      prevMatches.filter((match) => match !== Number(val))
    );
  };

  useEffect(() => {
    fetch("/index")
      .then((res) => res.json())
      .then((data) => {
        setMatchesData(data.matches);
        // setFollowedMatches(data.followed_matches);
      });
  }, []);

  useEffect(() => {
    fetch("/get_followed_matches")
      .then((res) => res.json())
      .then((data) => {
        setFollowedMatches(data.followed_matches);
      });
  }, []);

  const follow_match = (id) => {
    fetch("/follow_match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.state);
        res.state === "added"
          ? addFollow(id)
          : res.state === "deleted"
          ? deleteFollow(id)
          : console.log("Auth");
      })
      .catch((error) => console.error(error));
    navigate("/");
  };

  console.log(followedMatches);

  return (
    <IndexContext.Provider
      value={{ matchesData, follow_match, followedMatches }}
    >
      {<TodaysMatches />}
    </IndexContext.Provider>
  );
}

export default IndexPage;
