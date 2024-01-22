import React from "react";
import "../styles/Rules.scss";

function About() {
  return (
    <div className="about-container">
      <div className="title-header">
        <h2>Les règles du BlackJack</h2>
      </div>
      <p className="text-about">
        <h3>Objectif du Jeu</h3>
        Le blackjack, également connu sous le nom de 21, est un jeu de cartes
        captivant où l'objectif est simple : battre le croupier en obtenant une
        main dont la valeur est plus proche de 21 sans la dépasser.
        <h3>Les Cartes</h3>
        Les cartes numérotées valent leur propre nombre. Les cartes à face (Roi,
        Reine, Valet) valent 10. L'As peut valoir 1 ou 11, selon la meilleure
        option.
        <h3>Le Déroulement</h3>
        <ul>
          <li>
            Options du Joueur :
            <ul>
              <li>+1 Carte : Demander une carte supplémentaire.</li>
              <li>Rester : Conserver la main actuelle.</li>
            </ul>
          </li>
          <li>
            Le Croupier : Tire des cartes jusqu'à ce que la valeur atteigne au
            moins 17.
          </li>
          <li>
            Gagnant : La main la plus proche de 21 sans la dépasser remporte la
            partie.
          </li>
        </ul>
        <h3>Le "BLACKJACK" Spécial</h3>
        Le "BLACKJACK" se produit avec une main initiale de 21 (As + carte de
        valeur 10). Obtenez-le, et vous recevrez un paiement spécial de 2,5 fois
        votre mise, ajoutant une dose d'excitation au jeu.
      </p>
    </div>
  );
}

export default About;
