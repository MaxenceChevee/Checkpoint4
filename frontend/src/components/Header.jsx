import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.scss";
import logoImage from "../assets/Cash5.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <button type="button" className="menu-button" onClick={toggleMenu}>
        ☰
      </button>

      <Link to="/" className="logo-desktop" onClick={closeMenu}>
        Accueil
      </Link>
      <Link to="/rules" className="logo-desktop" onClick={toggleMenu}>
        Règles du jeu
      </Link>

      {!user ? (
        <>
          <Link to="/connexion" className="logo-desktop" onClick={toggleMenu}>
            Connexion
          </Link>

          <Link to="/inscription" className="logo-desktop" onClick={toggleMenu}>
            Inscription
          </Link>
        </>
      ) : (
        <>
          <p className="logo-desktop">Crédits: {user && user.credits}$</p>
          <Link to="/settings" className="logo-desktop" onClick={closeMenu}>
            Réglages
          </Link>
          <Link to="/" className="logo-desktop" onClick={logout}>
            Déconnexion
          </Link>
        </>
      )}

      <img src={logoImage} alt="Logo" className="logo-image" />

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="logo" onClick={closeMenu}>
          Accueil
        </Link>
        <Link to="/rules" className="logo" onClick={toggleMenu}>
          Règles du jeu
        </Link>

        {user ? (
          <>
            <p className="logo">Crédits: {user.credits}$</p>

            <Link to="/settings" className="logo" onClick={closeMenu}>
              Réglages
            </Link>
            <Link to="/" className="logo" onClick={logout}>
              Déconnexion
            </Link>
          </>
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
      </div>
    </header>
  );
}

export default Header;
