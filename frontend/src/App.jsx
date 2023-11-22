import React, { useContext, useEffect, useState, createContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import IndexPage from "./pages/index/IndexPage";
import LogoutPage from "./pages/logout/LogoutPage";
import LoginPage from "./pages/signIn/LoginPage";
import RegisterPage from "./pages/signUp/RegisterPage";
import MyProfilePage from "./pages/profile/MyProfilePage";
import CookiesRequest from "./components/CookiesRequest";
import "./index.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import MatchDetails from "./pages/matchDetails/MatchDetails";
import CountryRankingPage from "./pages/countryRanking/CountryRankingPage";
import Matches from "./components/Matches";

export const Context = createContext();

const ProtectedRoute = ({ anti = false, children }) => {
  const { user } = useContext(Context);
  if (user.auth && anti) {
    return <Navigate to="/" replace />;
  } else if (!user.auth && anti === false) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
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
      body: JSON.stringify({ id: id, details: details }),
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

  useEffect(() => {
    updateAuth();
    updateFollowedMatches();
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
    <BrowserRouter>
      <Context.Provider
        value={{
          user,
          login,
          logout,
          darkmode,
          toggleDarkmode,
          follow_match,
          showCookiesRequset,
          toggleCookiesRequest,
          updateAuth,
          updateFollowedMatches,
          followedMatches,
        }}
      >
        <Navbar />
        <div
          className={darkmode === "darkmode" ? "routes" : "routes_lightmode"}
        >
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route
              path="login"
              element={
                <ProtectedRoute anti={true}>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="logout"
              element={
                <ProtectedRoute>
                  <LogoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="signup"
              element={
                <ProtectedRoute anti={true}>
                  <RegisterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="about" element={<IndexPage />} />
            <Route path="match_details/:match_id" element={<MatchDetails />} />
            <Route path="country_ranking" element={<CountryRankingPage />} />
            <Route
              path="test"
              element={
                <Matches
                  title="test"
                  matches={user.followed_matches}
                  message="No data"
                />
              }
            />
            <Route
              path="*"
              element={<h1>ERROROROROOROROR STOP STOP STOP STOP STOP!!!!!!</h1>}
            />
          </Routes>
        </div>

        <img src="images/logo512.png" alt="background" className="background" />
        {showCookiesRequset && <CookiesRequest />}
      </Context.Provider>
    </BrowserRouter>
  );
};

export default App;
