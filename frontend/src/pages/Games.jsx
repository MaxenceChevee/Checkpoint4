import { Link } from "react-router-dom";
import BlackjackGame from "./BlackJackGame";
import GameStatus from "../components/GameStatus";

function Games() {
  return (
    <div>
      <h2>BLACKJACK</h2>
      <Link to="/">
        <button type="button">Retour à la page d'accueil</button>
      </Link>
      <BlackjackGame />
      <GameStatus playerTotal={18} dealerTotal={20} />
    </div>
  );
}

export default Games;
