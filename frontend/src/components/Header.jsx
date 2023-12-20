import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.scss";
import logoImage from "../assets/roulette.png";

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
      <img src={logoImage} alt="Logo" className="logo-image" />
      <h1>RollRich</h1>
      <Link to="/" className="logo-desktop">
        Accueil
      </Link>
      <Link to="/connexion" className="logo-desktop" onClick={toggleMenu}>
        Connexion
      </Link>

      <Link to="/contact" className="logo-desktop" onClick={toggleMenu}>
        Contact
      </Link>

      <Link to="/inscription" className="logo-desktop" onClick={toggleMenu}>
        Inscription
      </Link>
      <button type="button" className="menu-button" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="logo" onClick={closeMenu}>
          Accueil
        </Link>
        <Link to="/connexion" className="logo" onClick={toggleMenu}>
          Connexion
        </Link>

        <Link to="/contact" className="logo" onClick={toggleMenu}>
          Contact
        </Link>

        <Link to="/inscription" className="logo" onClick={toggleMenu}>
          Inscription
        </Link>
      </div>
    </header>
  );
}

export default Header;
