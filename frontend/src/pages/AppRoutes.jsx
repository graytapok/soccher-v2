import React, { useContext } from "react";
import { Context } from "../App";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import CookiesRequest from "../components/CookiesRequest";

import IndexPage from "./index/IndexPage";
import MatchDetails from "./matchDetails/MatchDetails";
import CountryRankingPage from "./countryRanking/CountryRankingPage";
import LeaguePage from "./league/LeaguePage";

import LogoutPage from "./auth/logout/LogoutPage";
import LoginPage from "./auth/signIn/LoginPage";
import RegisterPage from "./auth/signUp/RegisterPage";
import ProfilePage from "./auth/profile/ProfilePage";
import ConfirmEmailPage from "./auth/confirmEmail/ConfirmEmailPage";
import ForgotPasswordPage from "./auth/forgotPassword/ForgotPasswordPage";
import ChangePasswordPage from "./auth/changePasword/ChangePasswordPage";

import DashboardPage from "./admin/dashboard/DashboardPage";
import "../index.css";

const ProtectedRoute = ({
  anti = false,
  admin = false,
  confirmed = false,
  children,
}) => {
  const { user } = useContext(Context);

  if (
    (user.admin === false && admin) ||
    (user.auth && anti) ||
    (user.auth === false && anti === false && confirmed === false)
  ) {
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
          <>
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
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="match_details/:match_id" element={<MatchDetails />} />
            <Route path="country_ranking" element={<CountryRankingPage />} />
            <Route path="/league/:league_id" element={<LeaguePage />} />
            <Route
              path="/confirm_email/:email/:token"
              element={<ConfirmEmailPage />}
            />
            <Route
              path="/forgot_password"
              element={
                <ProtectedRoute anti>
                  <ForgotPasswordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change_password/:email/:token"
              element={<ChangePasswordPage />}
            />
          </>
          <>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute admin>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </>
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </div>
      {showCookiesRequset && <CookiesRequest />}
    </BrowserRouter>
  );
}

export default AppRoutes;
