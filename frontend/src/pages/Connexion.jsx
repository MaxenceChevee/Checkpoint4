import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Connexion.scss";

const Connexion = () => {
  const { user: isLoggedIn } = useAuth();
  const [user, setUser] = useState({
    mail: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState(null);
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

  const handleConnexion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3310/api/login",
        user
      );

      const { token } = response.data;

      localStorage.setItem("token", token);

      setLoginStatus("Connexion réussie");

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
    <div className="connexion-form-container">
      <h2>Connexion</h2>
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
            Password:
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
    </div>
  );
};
export default Connexion;
