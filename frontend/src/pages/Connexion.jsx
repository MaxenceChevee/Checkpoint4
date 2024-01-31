import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Popup from "../components/Popup";
import "../styles/Connexion.scss";

const Connexion = () => {
  const { user: isLoggedIn } = useAuth();
  const [user, setUser] = useState({
    mail: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleConnexion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3310/api/login",
        user
      );

      const { token } = response.data;

      localStorage.setItem("token", token);
      setShowPopup(true);

      console.info(response.data);
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Erreur lors de la connexion");
        }
      } else {
        setErrorMessage("Erreur lors de la connexion au serveur");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handlePopupClose = () => {
    setShowPopup(false);
    window.location.reload();
  };

  return (
    <div className="connexion-form-container">
      <h2>Connectez-vous</h2>
      {errorMessage && (
        <p className="connexion-error-message">{errorMessage}</p>
      )}
      <form onSubmit={handleConnexion}>
        <div className="connexion-form-label">
          <label>
            Mail:
            <input
              type="text"
              name="mail"
              value={user.mail}
              onChange={handleInputChange}
              className="connexion-form-input"
            />
          </label>
        </div>
        <div className="connexion-form-label">
          <label>
            Mot de passe:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="connexion-form-input"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleConnexion}
          className="connexion-form-button"
        >
          Se connecter
        </button>
      </form>
      <p>
        Vous n'avez pas de compte ?
        <Link to="/inscription" className="signup-link">
          Inscrivez-vous
        </Link>
      </p>
      {showPopup && (
        <Popup message="Connexion réussie" onClose={handlePopupClose} />
      )}
    </div>
  );
};

export default Connexion;
