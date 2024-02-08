import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.scss";

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
      <div className="header-content">
        <div className="messagedefilant">
          <div
            data-text={
              user
                ? `Bonjour ${user.pseudoname}, avec ${user.credits}$ prêts à être misés, pourquoi ne pas rejoindre la table de blackjack pour tenter votre chance ? Les cartes sont déjà distribuées, ne manquez pas cette opportunité de remporter gros ! 💰`
                : "Ne laissez pas la chance passer à côté de vous ! Rejoignez-nous dès maintenant pour une expérience de blackjack inoubliable. Êtes-vous prêt à jouer et à gagner gros?"
            }
          >
            <span>
              {user
                ? `Bonjour ${user.pseudoname}, avec ${user.credits}$ prêts à être misés, pourquoi ne pas rejoindre la table de blackjack pour tenter votre chance ? Les cartes sont déjà distribuées, ne manquez pas cette opportunité de remporter gros ! 💰`
                : "Ne laissez pas la chance passer à côté de vous ! Rejoignez-nous dès maintenant pour une expérience de blackjack inoubliable. Êtes-vous prêt à jouer et à gagner gros ?"}
            </span>
          </div>
        </div>
        <div className="friend-container">
          {user && (
            <>
              <Link to="/unread-notifications" className="notification-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fffafa"
                  viewBox="0 0 256 256"
                  className="logo-image"
                  onClick={closeMenu}
                >
                  <path d="M224,71.1a8,8,0,0,1-10.78-3.42,94.13,94.13,0,0,0-33.46-36.91,8,8,0,1,1,8.54-13.54,111.46,111.46,0,0,1,39.12,43.09A8,8,0,0,1,224,71.1ZM35.71,72a8,8,0,0,0,7.1-4.32A94.13,94.13,0,0,1,76.27,30.77a8,8,0,1,0-8.54-13.54A111.46,111.46,0,0,0,28.61,60.32,8,8,0,0,0,35.71,72Zm186.1,103.94A16,16,0,0,1,208,200H167.2a40,40,0,0,1-78.4,0H48a16,16,0,0,1-13.79-24.06C43.22,160.39,48,138.28,48,112a80,80,0,0,1,160,0C208,138.27,212.78,160.38,221.81,175.94ZM150.62,200H105.38a24,24,0,0,0,45.24,0ZM208,184c-10.64-18.27-16-42.49-16-72a64,64,0,0,0-128,0c0,29.52-5.38,53.74-16,72Z" />
                </svg>
              </Link>
              <Link to="/read-notifications" className="notification-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fffafa"
                  viewBox="0 0 256 256"
                  className="notification-image"
                >
                  <path d="M152,144a8,8,0,0,1-8,8H112a8,8,0,0,1-6.65-12.44L129.05,104H112a8,8,0,0,1,0-16h32a8,8,0,0,1,6.65,12.44L127,136h17A8,8,0,0,1,152,144Zm69.84,48A15.8,15.8,0,0,1,208,200H167.19a40,40,0,0,1-78.38,0H48a16,16,0,0,1-13.8-24.06C39.75,166.38,48,139.34,48,104a80,80,0,1,1,160,0c0,35.33,8.26,62.38,13.81,71.94A15.89,15.89,0,0,1,221.84,192Zm-71.22,8H105.38a24,24,0,0,0,45.24,0ZM208,184c-7.73-13.27-16-43.95-16-80a64,64,0,1,0-128,0c0,36.06-8.28,66.74-16,80Z" />
                </svg>
              </Link>
              <Link to="/friend-list" className="notification-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fffafa"
                  viewBox="0 0 256 256"
                  className="friend-list-image"
                >
                  <path d="M144,80a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H152A8,8,0,0,1,144,80Zm104,40H152a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm0,48H176a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm-96.25,22a8,8,0,0,1-5.76,9.74,7.55,7.55,0,0,1-2,.26,8,8,0,0,1-7.75-6c-6.16-23.94-30.34-42-56.25-42s-50.09,18.05-56.25,42a8,8,0,0,1-15.5-4c5.59-21.71,21.84-39.29,42.46-48a48,48,0,1,1,58.58,0C164.6,164.44,183.18,177.07,198.13,194.85ZM80,136a32,32,0,1,0-32-32A32,32,0,0,0,80,136Z" />
                </svg>
              </Link>
              <Link to="/add-friend" className="notification-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#fffafa"
                  viewBox="0 0 256 256"
                  className="add-friend-image"
                >
                  <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="logo" onClick={closeMenu}>
          Accueil
        </Link>
        <Link to="/rules" className="logo" onClick={toggleMenu}>
          Règles du jeu
        </Link>

        {!user ? (
          <>
            <Link to="/connexion" className="logo" onClick={toggleMenu}>
              Connexion
            </Link>
            <Link to="/inscription" className="logo" onClick={toggleMenu}>
              Inscription
            </Link>
          </>
        ) : (
          <>
            <Link to="/settings" className="logo" onClick={closeMenu}>
              Réglages
            </Link>
            <Link to="/" className="logo" onClick={logout}>
              Déconnexion
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
