import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Connexion.scss";

const Connexion = () => {
  const { user: isLoggedIn } = useAuth();
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

      localStorage.setItem("token", token);

      setLoginStatus("Connexion réussie");

      setHasLogged(true);

      console.info(response.data);
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus("Erreur lors de la connexion");
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
