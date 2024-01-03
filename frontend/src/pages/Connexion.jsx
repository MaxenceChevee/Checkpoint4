import React, { useState } from "react";
import axios from "axios";

import "../styles/Connexion.scss";

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const handleConnexion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/connexion", {
        email,
        motDePasse,
      });
      // eslint-disable-next-line no-restricted-syntax
      console.log(response.data);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Connexion</h2>
      <form onSubmit={handleConnexion}>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemple.email.com"
          required
        />

        <label htmlFor="motDePasse">Mot de passe :</label>
        <input
          type="password"
          id="motDePasse"
          name="motDePasse"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="******"
          required
        />

        <button type="submit" className="button-register">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Connexion;
