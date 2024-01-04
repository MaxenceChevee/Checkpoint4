import React from "react";
import PropTypes from "prop-types";

const GameStatus = ({ playerTotal, dealerTotal, gameInProgress }) => {
  let status = "";

  if (gameInProgress) {
    if (playerTotal > 21) {
      status = "Le joueur a dépassé 21. C'est une défaite!";
    } else if (dealerTotal > 21) {
      status = "Le croupier a dépassé 21. C'est une victoire!";
    } else if (playerTotal === dealerTotal) {
      status = "Égalité!";
    } else if (playerTotal === 21) {
      status = "Blackjack! Le joueur a gagné!";
    } else if (dealerTotal === 21) {
      status = "Blackjack! Le croupier a gagné!";
    } else if (
      dealerTotal > 16 &&
      dealerTotal < playerTotal &&
      dealerTotal <= 21
    ) {
      status = "Le croupier a gagné!";
    } else if (
      playerTotal > 16 &&
      playerTotal < dealerTotal &&
      playerTotal <= 21
    ) {
      status = "Partie en cours";
    }
  }

  return <div>{status}</div>;
};

GameStatus.propTypes = {
  playerTotal: PropTypes.number.isRequired,
  dealerTotal: PropTypes.number.isRequired,
  gameInProgress: PropTypes.bool.isRequired,
};

export default GameStatus;
