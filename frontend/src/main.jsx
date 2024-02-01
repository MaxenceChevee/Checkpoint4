import React from "react";
import ReactDOM from "react-dom/client";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" />;
  }

  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const Main = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="games" element={<Games />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="forgot-password"
          element={user ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="reset-password/:token"
          element={user ? <Navigate to="/" /> : <ResetPassword />}
        />
        <Route
          path="blackjack-game"
          element={<PrivateRoute element={<BlackJackGame />} />}
        />
        <Route
          path="Wheelset"
          element={<PrivateRoute element={<Wheelset />} />}
        />
        <Route
          path="connexion"
          element={user ? <Navigate to="/" /> : <Connexion />}
        />
        <Route path="rules" element={<Rules />} />
        <Route
          path="inscription"
          element={user ? <Navigate to="/" /> : <Inscription />}
        />
        <Route
          path="settings"
          element={<PrivateRoute element={<Settings />} />}
        />
      </Route>
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
