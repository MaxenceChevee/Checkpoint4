import React, { useState, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";

const SendGift = ({ receiverId }) => {
  const { user } = useContext(AuthContext);

  const [creditsAmount, setCreditsAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSendGift = async () => {
    const credits = parseInt(creditsAmount, 10);

    if (Number.isNaN(credits)) {
      console.error("Invalid credits amount");
      setMessage("Le montant de crédits n'est pas valide.");
      return;
    }

    try {
      const jwtToken = localStorage.getItem("token");
      if (!jwtToken) {
        console.error("Access denied. No token provided.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3310/api/send-gift",
        {
          senderId: user.id,
          receiverId,
          creditsAmount: credits,
        },
        {
          headers: {
            "x-auth-token": jwtToken,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error sending gift:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        setMessage(errorMessage);
      } else {
        setMessage(
          "Erreur lors de l'envoi du cadeau. Veuillez réessayer plus tard."
        );
      }
    }
  };

  return (
    <div>
      <h2>Envoyer un cadeau</h2>
      <label htmlFor="creditsAmount">Montant de crédits :</label>
      <input
        type="text"
        id="creditsAmount"
        value={creditsAmount}
        onChange={(e) => setCreditsAmount(e.target.value)}
      />
      <button type="button" onClick={handleSendGift}>
        Envoyer
      </button>
      <p>{message}</p>
    </div>
  );
};
SendGift.propTypes = {
  receiverId: PropTypes.node.isRequired,
};

export default SendGift;
