import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import IndexPage from "./pages/IndexPage";
import LogoutPage from "./pages/LogoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./components/styles/index.css";
import { useState, createContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

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
    followed_matches: [],
  });

  useEffect(() => {
    fetch("/auth")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [user.auth]);

  const [darkMode, setDarkMode] = useState(false);

  const login = () => {
    setUser({ ...user, auth: true });
    console.log("Authenticated: true");
  };

  const logout = () => {
    setUser({ ...user, auth: false });
    console.log("Authenticated: false");
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
          <Route
            path="signup"
            element={
              <ProtectedRoute anti={true}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route path="my_profile" element={<ProfilePage />} />
          <Route path="about" element={<IndexPage />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
};

export default App;
