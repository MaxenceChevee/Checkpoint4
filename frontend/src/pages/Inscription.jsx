import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import "../styles/Inscription.scss";

const Inscription = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    pseudoname: "",
    mail: "",
    password: "",
    confirmPassword: "",
  });
  const [popupData, setPopupData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleInscription = async () => {
    // Vérifier les conditions avant d'envoyer la requête
    if (
      user.firstname.length < 2 ||
      user.lastname.length < 2 ||
      user.pseudoname.length < 2
    ) {
      setErrorMessage("Les champs doivent contenir au moins 2 caractères.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3310/api/users",
        JSON.stringify(user),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setPopupData({
        message: "Vous êtes bien inscrit",
        onClose: () => {
          setPopupData(null);
          navigate("/connexion"); // Redirige vers la page de connexion
        },
      });
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Erreur lors de l'inscription");
        }
      } else {
        setErrorMessage("Erreur lors de la connexion au serveur");
      }
    }
  };

  return (
    <div className="inscription-form-container">
      <h2>Inscription</h2>
      {errorMessage && (
        <p className="inscription-error-message">{errorMessage}</p>
      )}
      <form onSubmit={handleInscription}>
        <div>
          <label className="inscription-form-label">
            Firstname:
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleInputChange}
              className="inscription-form-input"
            />
          </label>
        </div>
        <div>
          <label className="inscription-form-label">
            Lastname:
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleInputChange}
              className="inscription-form-input"
            />
          </label>
        </div>
        <div>
          <label className="inscription-form-label">
            Pseudoname:
            <input
              type="text"
              name="pseudoname"
              value={user.pseudoname}
              onChange={handleInputChange}
              className="inscription-form-input"
            />
          </label>
        </div>
        <div>
          <label className="inscription-form-label">
            Mail:
            <input
              type="text"
              name="mail"
              value={user.mail}
              onChange={handleInputChange}
              className="inscription-form-input"
            />
          </label>
        </div>
        <div>
          <label className="inscription-form-label">
            Password:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="inscription-form-input"
            />
          </label>
        </div>
        <div>
          <label className="inscription-form-label">
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputChange}
              className="inscription-form-input"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleInscription}
          className="inscription-form-button"
        >
          S'inscrire
        </button>
      </form>
      {popupData && (
        <Popup message={popupData.message} onClose={popupData.onClose} />
      )}
    </div>
  );
};

export default Inscription;
