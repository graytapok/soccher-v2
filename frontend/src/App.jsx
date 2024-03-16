import React, { useEffect, useState, createContext } from "react";
import AppRoutes from "./pages/AppRoutes";
import "./index.css";

export const Context = createContext();

const App = () => {
  const [user, setUser] = useState({});

  const updateAuth = async () => {
    let res = await fetch("/api/auth");
    res = await res.json();
    setUser(res.data);
  };

  const logout = () => {
    fetch("/api/auth/logout")
      .then((res) => res.json())
      .then((res) => res.success && setUser({ ...user, auth: false }));
  };

  const [followedMatches, setFollowedMatches] = useState([]);
  const [followedLeagues, setFollowedLeagues] = useState([]);
  const updateFollowedMatches = () => {
    fetch("/api/auth/followed_matches")
      .then((res) => res.json())
      .then((res) => {
        setFollowedMatches(res.data);
      });
  };

  const updateFollowedLeagues = () => {
    fetch("/api/auth/followed_leagues")
      .then((res) => res.json())
      .then((res) => {
        setFollowedLeagues(res.data);
      });
  };

  const followMatch = (details = {}) => {
    fetch("/api/auth/follow_match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        details: details,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        res.success && updateFollowedMatches();
      })
      .catch((error) => console.error(error));
  };
  const unFollowMatch = (id) => {
    fetch(`/api/auth/follow_match?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res.success && updateFollowedMatches();
      })
      .catch((error) => console.error(error));
  };
  const followLeague = (details = {}) => {
    fetch("/api/auth/follow_league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        details: details,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        res.success && updateFollowedLeagues();
      })
      .catch((error) => console.error(error));
  };
  const unFollowLeague = (id) => {
    fetch(`/api/auth/follow_league?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res.success && updateFollowedLeagues();
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    updateAuth();
    updateFollowedMatches();
    updateFollowedLeagues();
  }, [user.auth]);

  const [showCookiesRequset, setShowCookiesRequest] = useState(true);
  const getCookie = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  useEffect(() => {
    setShowCookiesRequest(
      getCookie("darkmode") !== "" ||
        getCookie("remember_token") !== "" ||
        getCookie("session") !== ""
        ? false
        : true
    );
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
        updateAuth,
        logout,

        followLeague,
        followMatch,
        unFollowLeague,
        unFollowMatch,

        followedMatches,
        followedLeagues,
        updateFollowedLeagues,
        updateFollowedMatches,

        darkmode,
        toggleDarkmode,
        showCookiesRequset,
        toggleCookiesRequest,
      }}
    >
      <AppRoutes />
    </Context.Provider>
  );
};

export default App;
