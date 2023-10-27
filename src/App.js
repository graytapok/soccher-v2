import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./components/styles/index.css";

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/index")
      .then((res) => res.json())
      .then((data) => {
        setIsUserAuthenticated(data.auth);
        console.log(data);
      });
  }, []);

  /* const redirectTo = (link) => {
    window.location.replace(`/${link}`);
  }; */

  console.log(isUserAuthenticated);

  return (
    <Router>
      <Navbar auth={isUserAuthenticated} />
      <Routes>
        <Route exact path="/" />
      </Routes>
    </Router>
  );
}

export default App;
