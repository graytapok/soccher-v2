import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import IndexPage from "./pages/IndexPage";
import LogoutPage from "./pages/LogoutPage";
import LoginPage from "./pages/LoginPage";
import "./components/styles/index.css";
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
  useEffect(() => {
    const userData = fetch("/auth")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const [user, setUser] = useState({
    auth: false,
    name: "",
    id: "",
    email: "",
    followed_matches: [],
  });

  console.log(user);

  const [darkMode, setDarkMode] = useState(false);

  const login = () => {
    setUser({ ...user, auth: true });
    console.log("Authenticated: " + user.auth);
  };

  const logout = () => {
    fetch(`/logout`, { method: "GET" })
      .then((response) => response.json())
      .then((res) =>
        res.logged_out ? (window.location.href = "/") : console.log("Error")
      );
    setUser({ ...user, auth: false });
    console.log("Authenticated: " + user.auth);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    console.log("Dark Mode: " + darkMode);
  };

  return (
    <BrowserRouter>
      <Context.Provider
        value={{ user, login, logout, darkMode, toggleDarkMode }}
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
          <Route path="my_profile" element={<IndexPage />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
};

export default App;
