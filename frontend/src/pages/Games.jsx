// Games.jsx
import React from "react";
import { Link } from "react-router-dom";
import GameStatus from "../components/GameStatus";

function Games() {
  return (
    <div>
      <h2>BLACKJACK</h2>
      <Link to="/">
        <button type="button">Retour à la page d'accueil</button>
      </Link>
      <Link to="/blackjack-game">
        {" "}
        {/* Lien vers la nouvelle route du BlackjackGame */}
        <button type="button">Jouer au Blackjack</button>
      </Link>
      <GameStatus playerTotal={18} dealerTotal={20} gameInProgress={false} />
    </div>
  );
}

export default Games;
