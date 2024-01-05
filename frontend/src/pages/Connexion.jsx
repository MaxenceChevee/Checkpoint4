import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Connexion.scss";

const Connexion = () => {
  const [user, setUser] = useState({
    mail: "",
    password: "",
  });

  const [loginStatus, setLoginStatus] = useState(null);

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

      // Mise à jour du statut de connexion
      setLoginStatus("Connexion réussie");

      // eslint-disable-next-line no-restricted-syntax
      console.log(response.data);
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus("Erreur lors de la connexion");
    }
  };

  // Si la connexion est réussie, affiche le message avec le bouton de redirection
  if (loginStatus === "Connexion réussie") {
    return (
      <div className="form-container">
        <h2>{loginStatus}</h2>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  // Si la connexion n'est pas encore réussie, affiche le formulaire
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
