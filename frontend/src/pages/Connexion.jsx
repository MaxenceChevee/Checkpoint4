// Connexion.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Connexion.scss";

const Connexion = () => {
  const { user: isloggedIn } = useAuth();
  const [, setHasLogged] = useState(false);
  const [user, setUser] = useState({
    mail: "",
    password: "",
  });

  const [loginStatus, setLoginStatus] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleConnexion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3310/api/login",
        user
      );

      const { token } = response.data;

      // Stockez le token dans le local storage
      localStorage.setItem("token", token);

      // Mise à jour du statut de connexion
      setLoginStatus("Connexion réussie");

      setHasLogged(true);

      // Connexion réussie, appeler la fonction login du contexte
      console.info(response.data);
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus("Erreur lors de la connexion");
    }
  };

  if (isloggedIn) {
    navigate("/");
  }
  // Si la connexion est réussie, affiche le message avec le bouton de redirection
  if (loginStatus === "Connexion réussie") {
    return (
      <div className="form-container">
        <h2>{loginStatus}</h2>
        <button type="button" onClick={() => window.location.reload()}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Connexion</h2>
      <form onSubmit={handleConnexion}>
        <div>
          <label>
            Mail:
            <input
              type="text"
              name="mail"
              value={user.mail}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="button" onClick={handleConnexion}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Connexion;
