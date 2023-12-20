import { Link } from "react-router-dom";

function Games() {
  return (
    <div>
      <h2>Jeux de cartes</h2>
      <Link to="/">
        <button type="button">Retour à la page d'accueil</button>
      </Link>
    </div>
  );
}

export default Games;
