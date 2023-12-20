import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.scss";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
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
        <Link to="/" className="logo">
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
