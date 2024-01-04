// Card.jsx
import React from "react";
import PropTypes from "prop-types";
import "../styles/Card.scss";

const getSuitSymbol = (suit) => {
  switch (suit) {
    case "hearts":
      return "♥";
    case "diamonds":
      return "♦";
    case "clubs":
      return "♣";
    case "spades":
      return "♠";
    default:
      return "";
  }
};

const Card = ({ rank, suit, isFaceUp }) => {
  return (
    <div
      className={`card ${getSuitSymbol(suit)} ${!isFaceUp ? "face-down" : ""}`}
    >
      <div className="card-text">
        <div className="top-left">
          {rank}
          {getSuitSymbol(suit)}
        </div>
        <div className="top-right">
          {rank}
          {getSuitSymbol(suit)}
        </div>
        <div className="bottom-left">
          {rank}
          {getSuitSymbol(suit)}
        </div>
        <div className="bottom-right">
          {rank}
          {getSuitSymbol(suit)}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suit: PropTypes.oneOf(["hearts", "diamonds", "clubs", "spades"]).isRequired,
  isFaceUp: PropTypes.bool.isRequired,
};

export default Card;
