import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Games from "./pages/Games";
import App from "./App";
import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Rules from "./pages/Rules";
import Inscription from "./pages/Inscription";
import "./styles/Global.scss";
import BlackJackGame from "./pages/BlackJackGame";
import Settings from "./pages/Settings";
import Wheelset from "./pages/Wheelset";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="games" element={<Games />} />
            <Route path="blackjack-game" element={<BlackJackGame />} />
            <Route path="Wheelset" element={<Wheelset />} />
            <Route path="connexion" element={<Connexion />} />
            <Route path="rules" element={<Rules />} />
            <Route path="inscription" element={<Inscription />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
