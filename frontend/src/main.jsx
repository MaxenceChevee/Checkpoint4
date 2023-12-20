import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Games from "./pages/Games";
import App from "./App";
import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Contact from "./pages/Contact";
import Inscription from "./pages/Inscription";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="games" element={<Games />} />
          <Route path="connexion" element={<Connexion />} />
          <Route path="contact" element={<Contact />} />
          <Route path="inscription" element={<Inscription />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
