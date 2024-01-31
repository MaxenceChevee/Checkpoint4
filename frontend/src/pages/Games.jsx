import React from "react";
import { Link } from "react-router-dom";
import blackjackImage from "../assets/blackjack.jpg";
import roueImage from "../assets/roue.png";
import "../styles/Games.scss";

function Games() {
  return (
    <div className="page-container">
      <h2 className="game-title">Choisissez votre jeu</h2>
      <div className="game-container">
        <Link to="/blackjack-game" className="game-link">
          <img src={blackjackImage} alt="blackjack" className="game-image" />
          <button className="game-button casino-animation" type="button">
            Jouer au Blackjack
          </button>
        </Link>

        <Link to="/wheelset" className="game-link">
          <img src={roueImage} alt="roue" className="game-image" />
          <button className="game-button casino-animation" type="button">
            Tournez la roue et tentez de gagner des crédits !
          </button>
        </Link>
      </div>
      <Link to="/">
        <button className="game-button" type="button">
          Retour à la page d'accueil
        </button>
      </Link>
    </div>
  );
}

export default Games;
