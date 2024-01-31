import React from "react";
import PropTypes from "prop-types";
import "../styles/Popup.scss";

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <p>{message}</p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
Popup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Popup;
