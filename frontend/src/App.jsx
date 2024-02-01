import React, { useEffect, useState, createContext } from "react";
import AppRoutes from "./pages/AppRoutes";
import "./index.css";

export const Context = createContext();

const App = () => {
  const [user, setUser] = useState({});

  const logout = () => {
    fetch("/auth/logout")
      .then((res) => res.json())
      .then((data) =>
        data.success
          ? setUser({ ...user, auth: false })
          : console.log("Unexpected Error")
      );
  };

  const followMatch = (details) => {
    fetch("/auth/follow_match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: details.id, details: details }),
    })
      .then((res) => res.json())
      .then((res) => (res.success ? updateAuth() : console.log(res.message)));
  };
  const unFollowMatch = (id) => {
    fetch(`/auth/follow_match?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => (res.success ? updateAuth() : console.log(res.message)));
  };

  const followLeague = (details) => {
    fetch("/auth/follow_league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: details.id, details: details }),
    })
      .then((res) => res.json())
      .then((res) => (res.success ? updateAuth() : console.log(res.message)));
  };
  const unFollowLeague = (id) => {
    fetch(`/auth/follow_league?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => (res.success ? updateAuth() : console.log(res.message)));
  };

  const updateAuth = () => {
    fetch("/auth")
      .then((res) => res.json())
      .then((res) =>
        res.success ? setUser(res.data) : console.log(res.message)
      )
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    updateAuth();
  }, [user.auth]);

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
        updateAuth,
        logout,
        followLeague,
        followMatch,
        unFollowLeague,
        unFollowMatch,
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
