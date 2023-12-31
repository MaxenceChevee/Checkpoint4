// Header.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.scss";
import logoImage from "../assets/Roll1.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Rendre la barre de navigation uniquement si le chemin actuel n'est pas "/games"
  if (location.pathname === "/games") {
    return null;
  }

  return (
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <button type="button" className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <h1 className="game-name">RollRich</h1>

      <Link to="/" className="logo-desktop" onClick={closeMenu}>
        Accueil
      </Link>

      {!isLoggedIn ? (
        <>
          <Link to="/connexion" className="logo-desktop" onClick={toggleMenu}>
            Connexion
          </Link>

          <Link to="/inscription" className="logo-desktop" onClick={toggleMenu}>
            Inscription
          </Link>
        </>
      ) : (
        <Link to="/" className="logo-desktop" onClick={logout}>
          Déconnexion
        </Link>
      )}

      <Link to="/contact" className="logo-desktop" onClick={toggleMenu}>
        A propos
      </Link>

      <img src={logoImage} alt="Logo" className="logo-image" />

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="logo" onClick={closeMenu}>
          Accueil
        </Link>
        {isLoggedIn ? (
          <Link to="/" className="logo" onClick={logout}>
            Déconnexion
          </Link>
        ) : (
          <>
            <Link to="/connexion" className="logo" onClick={toggleMenu}>
              Connexion
            </Link>

            <Link to="/inscription" className="logo" onClick={toggleMenu}>
              Inscription
            </Link>
          </>
        )}

        <Link to="/contact" className="logo" onClick={toggleMenu}>
          A propos
        </Link>
      </div>
    </header>
  );
}

export default Header;
