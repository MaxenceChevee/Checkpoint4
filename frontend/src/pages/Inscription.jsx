import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
          navigate("/connexion");
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
            Prénom:
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
            Nom:
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
            Pseudo:
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
            Mot de passe:
            <p className="password-info">
              (8 caractères minimum dont 1 majuscule, 1 minuscule, 1 chiffre et
              1 caractère spécial)
            </p>
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
            Confirmer le mot de passe:
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
      <p>
        Vous avez déja un compte ?
        <Link to="/inscription" className="signup-link">
          Connectez-vous
        </Link>
      </p>
      {popupData && (
        <Popup message={popupData.message} onClose={popupData.onClose} />
      )}
    </div>
  );
};

export default Inscription;
