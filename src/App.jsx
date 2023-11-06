import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import IndexPage from "./pages/IndexPage/IndexPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MyProfilePage from "./pages/MyProfilePage/MyProfilePage";
import CookiesRequest from "./components/CookiesRequest";
import "./index.css";
import { useState, createContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

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
  const [user, setUser] = useState({
    auth: false,
    name: "",
    id: "",
    email: "",
    followed_matches: {},
  });
  const addFollow = (id, details) => {
    setUser((prevData) => ({
      ...prevData,
      followed_matches:
        user.followed_matches === undefined
          ? { [Number(id)]: details }
          : { ...prevData.followed_matches, [Number(id)]: details },
    }));
  };
  const deleteFollow = (id) => {
    delete user.followed_matches[id];
    setUser((prevData) => ({
      ...prevData,
      followed_matches: prevData.followed_matches,
    }));
  };
  const follow_match = (id, details = {}) => {
    fetch("/follow_match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, details: details }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.state);
        res.state === "added"
          ? addFollow(id, details)
          : res.state === "deleted"
          ? deleteFollow(id)
          : console.log("Auth");
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetch("/auth")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [user.auth]);

  const login = () => {
    setUser({ ...user, auth: true });
    console.log("Authenticated: true");
  };
  const logout = () => {
    fetch("/logout")
      .then((res) => res.json())
      .then((data) =>
        data.logged_out
          ? setUser({ ...user, auth: false })
          : console.log("Unexpected Error")
      );
    console.log("Authenticated: false");
  };

  const getCookie = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

  const [showCookiesRequset, setShowCookiesRequest] = useState(true);
  useEffect(() => {
    setShowCookiesRequest(getCookie("darkmode") !== "" ? false : true);
  }, []);
  const toggleCookiesRequest = () => {
    setShowCookiesRequest((prev) => !prev);
  };

  const [darkmode, setDarkmode] = useState(
    getCookie("darkmode") !== ""
      ? getCookie("darkmode") === "lightmode"
        ? "lightmode"
        : "darkmode"
      : "darkmode"
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
          addFollow,
          deleteFollow,
          follow_match,
          showCookiesRequset,
          toggleCookiesRequest,
        }}
      >
        <Navbar />
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
            path="my_profile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="about" element={<IndexPage />} />
          <Route
            path="*"
            element={<h1>ERROROROROOROROR STOP STOP STOP STOP STOP!!!!!!</h1>}
          />
        </Routes>
        <img src="images/logo512.png" alt="background" className="background" />
        {showCookiesRequset && <CookiesRequest />}
      </Context.Provider>
    </BrowserRouter>
  );
};

export default App;
