// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Games from "./pages/Games";
import App from "./App";
import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import About from "./pages/About";
import Inscription from "./pages/Inscription";
import "./styles/Global.scss";
import BlackJackGame from "./pages/BlackJackGame";

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

            <Route path="connexion" element={<Connexion />} />
            <Route path="contact" element={<About />} />
            <Route path="inscription" element={<Inscription />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
