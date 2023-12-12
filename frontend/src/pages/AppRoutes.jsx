import React, { useContext } from "react";
import { Context } from "../App";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import CookiesRequest from "../components/CookiesRequest";
import Ranking from "../components/Ranking";

import MatchDetails from "./matchDetails/MatchDetails";
import CountryRankingPage from "./countryRanking/CountryRankingPage";
import IndexPage from "./index/IndexPage";
import LogoutPage from "./logout/LogoutPage";
import LoginPage from "./signIn/LoginPage";
import RegisterPage from "./signUp/RegisterPage";
import MyProfilePage from "./profile/MyProfilePage";
import LeaguePage from "./league/LeaguePage";

import "../index.css";

const ProtectedRoute = ({ anti = false, children, admin = false }) => {
  const { user } = useContext(Context);
  if (admin && user.admin) {
  }

  if (user.auth && anti) {
    return <Navigate to="/" replace />;
  } else if (!user.auth && anti === false) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  const { darkmode, showCookiesRequset } = useContext(Context);

  return (
    <BrowserRouter>
      <Navbar />
      <div className={darkmode === "darkmode" ? "routes" : "routes_lightmode"}>
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
              <Ranking
                head={{
                  0: {
                    name: "Label",
                    sortable: true,
                    asc: "asc",
                    sort_by: "string",
                  },
                  1: {
                    name: "Rank",
                    sortable: true,
                    asc: "desc",
                    sort_by: "number",
                  },
                  2: { name: "Size", sortable: false, asc: null },
                }}
                body={{
                  0: ["bbdsfdds", "12312312312", "asdasd"],
                  1: ["gfedcbga", "12312312312", "asdasd"],
                  2: ["abcdefg", "12312312312", "asdasd"],
                }}
              />
            }
          ></Route>
          <Route path="/league/:league_id" element={<LeaguePage />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </div>

      <img
        src="images/react/logo512.png"
        alt="background"
        className="background"
      />
      {showCookiesRequset && <CookiesRequest />}
    </BrowserRouter>
  );
}

export default AppRoutes;
