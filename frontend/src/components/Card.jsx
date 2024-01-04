import PropTypes from "prop-types";

const Card = ({ number, suit }) => {
  const combo = number ? `${number}${suit}` : null;
  const color = suit === "♦" || suit === "♥" ? "card-red" : "card";

  return (
    <td key={`${number}${suit}`}>
      <div className={color}>{combo}</div>
    </td>
  );
};
Card.propTypes = {
  number: PropTypes.number.isRequired,
  suit: PropTypes.string.isRequired,
};
export default Card;
