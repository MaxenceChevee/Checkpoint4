// Importez useState depuis React pour gérer l'état de gameInProgress
import React, { useState } from "react";
import { Link } from "react-router-dom";
import BlackjackGame from "./BlackJackGame";
import GameStatus from "../components/GameStatus";

function Games() {
  // Utilisez useState pour gérer l'état de gameInProgress
  const [gameInProgress, setGameInProgress] = useState(true);

  // Utilisez setGameInProgress pour mettre à jour l'état
  const handleGameEnd = () => {
    setGameInProgress(false);
  };

  return (
    <div>
      <h2>BLACKJACK</h2>
      <Link to="/">
        <button type="button">Retour à la page d'accueil</button>
      </Link>
      <BlackjackGame onGameEnd={handleGameEnd} />
      {/* Fournissez gameInProgress comme propriété à GameStatus */}
      <GameStatus
        playerTotal={18}
        dealerTotal={20}
        gameInProgress={gameInProgress}
      />
    </div>
  );
}

export default Games;
