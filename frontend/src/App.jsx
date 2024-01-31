import React, { useEffect, useState, createContext } from "react";
import AppRoutes from "./pages/AppRoutes";
/* import { useIsFirstRender } from "@uidotdev/usehooks"; */
import "./index.css";

export const Context = createContext();

const App = () => {
  /* const firstRender = useIsFirstRender(); */

  const [user, setUser] = useState({ auth: false });

  const login = () => {
    setUser({ ...user, auth: true });
  };
  const logout = () => {
    fetch("/logout")
      .then((res) => res.json())
      .then((data) =>
        data.logged_out
          ? setUser({ ...user, auth: false })
          : console.log("Unexpected Error")
      );
  };

  const [followedMatches, setFollowedMatches] = useState({});
  const [followedLeagues, setFollowedLeagues] = useState({});

  const follow_match = (id, details = {}) => {
    const deleteFollow = (id) => {
      delete followedMatches[id];
      setFollowedMatches((prevData) => ({
        ...prevData,
      }));
    };

    fetch("/follow_match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: details.id, details: details }),
    })
      .then((res) => res.json())
      .then((res) => {
        res.state === "added"
          ? setFollowedMatches((prev) => ({ ...prev, [id]: details }))
          : res.state === "deleted"
          ? deleteFollow(id)
          : console.log("Auth");
      })
      .catch((error) => console.error(error));
  };
  const follow_league = (id, details = {}) => {
    const deleteFollow = (id) => {
      delete followedLeagues[id];
      setFollowedLeagues((prevData) => ({
        ...prevData,
      }));
    };

    fetch("/follow_league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: details.id, details: details }),
    })
      .then((res) => res.json())
      .then((res) => {
        res.state === "added"
          ? setFollowedLeagues((prev) => ({ ...prev, [id]: details }))
          : res.state === "deleted"
          ? deleteFollow(id)
          : console.log("Auth");
      })
      .catch((error) => console.error(error));
  };
  const updateAuth = () => {
    fetch("/auth")
      .then((res) => res.json())
      .then((data) => setUser(data));
  };
  const updateFollowedMatches = () => {
    fetch("/followed_matches")
      .then((res) => res.json())
      .then((data) => {
        setFollowedMatches(data.followed_matches);
      });
  };
  const updateFollowedLeagues = () => {
    fetch("/followed_leagues")
      .then((res) => res.json())
      .then((data) => {
        setFollowedLeagues(data.followed_leagues);
      });
  };

  useEffect(() => {
    updateAuth();
    updateFollowedMatches();
    updateFollowedLeagues();
  }, [user.auth /* , firstRender */]);

  const [showCookiesRequset, setShowCookiesRequest] = useState(true);
  const getCookie = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  useEffect(() => {
    setShowCookiesRequest(getCookie("darkmode") !== "" ? false : true);
  }, []);
  const toggleCookiesRequest = () => {
    setShowCookiesRequest((prev) => !prev);
  };
  const [darkmode, setDarkmode] = useState(
    getCookie("darkmode") !== "" ? getCookie("darkmode") : "darkmode"
  );
  const toggleDarkmode = () => {
    setDarkmode((prevMode) =>
      prevMode === "darkmode" ? "lightmode" : "darkmode"
    );
    const cookie = getCookie("darkmode");
    if (cookie !== "") {
      document.cookie = `darkmode=${
        darkmode === "darkmode" ? "lightmode" : "darkmode"
      }`;
    }
  };

  return (
    <Context.Provider
      value={{
        user,
        login,
        logout,
        darkmode,
        toggleDarkmode,
        follow_match,
        follow_league,
        showCookiesRequset,
        toggleCookiesRequest,
        updateAuth,
        updateFollowedMatches,
        followedMatches,
        followedLeagues,
      }}
    >
      <AppRoutes />
    </Context.Provider>
  );
};

export default App;
