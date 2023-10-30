import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./navigation/AuthWrapper";
import "./components/styles/index.css";
import useAuth from "./hooks/useAuth";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </>
  );
}

export default App;
