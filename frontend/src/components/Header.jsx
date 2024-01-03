import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.scss";
import logoImage from "../assets/Roll1.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      <h1 className="game-name">RollRich</h1>
      <Link to="/" className="logo-desktop">
        Accueil
      </Link>
      <Link to="/connexion" className="logo-desktop" onClick={toggleMenu}>
        Connexion
      </Link>

      <Link to="/contact" className="logo-desktop" onClick={toggleMenu}>
        A propos
      </Link>

      <Link to="/inscription" className="logo-desktop" onClick={toggleMenu}>
        Inscription
      </Link>

      <img src={logoImage} alt="Logo" className="logo-image" />

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="logo" onClick={closeMenu}>
          Accueil
        </Link>
        <Link to="/connexion" className="logo" onClick={toggleMenu}>
          Connexion
        </Link>

        <Link to="/contact" className="logo" onClick={toggleMenu}>
          A propos
        </Link>

        <Link to="/inscription" className="logo" onClick={toggleMenu}>
          Inscription
        </Link>
      </div>
    </header>
  );
}

export default Header;
