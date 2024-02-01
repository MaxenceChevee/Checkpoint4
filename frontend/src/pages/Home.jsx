import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.scss";

const Home = () => {
  const letters = "CashCatalyst";

  const getRandomDelay = () => `${Math.random() * 0.5}s`;

  return (
    <>
      <h1 className="site-name">
        {letters.split("").map((letter) => (
          <span key={`${letter}-${getRandomDelay()}`}>{letter}</span>
        ))}
      </h1>

      <div className="home-container">
        <h2 className="home-title">Bienvenue dans notre casino en ligne</h2>
        <p>
          Plongez dans le monde palpitant du jeu et de l'excitation. Notre
          casino en ligne vous offre une expérience unique où le divertissement
          et la chance se rencontrent.
        </p>

        <p>
          Tentez votre chance pour remporter d'incroyables jackpots et profitez
          d'une atmosphère immersive qui vous transportera directement dans
          l'univers du jeu.
        </p>
        <Link to="/games">
          <button className="home-button casino-animation" type="button">
            Commencer à jouer
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
