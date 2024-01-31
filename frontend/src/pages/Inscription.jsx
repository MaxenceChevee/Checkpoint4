import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleInscription = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3310/api/users",
        JSON.stringify(user),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;

      if (token && registrationStatus === "Vous êtes bien inscrit") {
        localStorage.setItem("token", token);
      }

      setRegistrationStatus("Vous êtes bien inscrit");
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

  if (registrationStatus === "Vous êtes bien inscrit") {
    return (
      <div className="form-container">
        <h2>{registrationStatus}</h2>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Inscription</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleInscription}>
        <div>
          <label>
            Firstname:
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Lastname:
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Pseudoname:
            <input
              type="text"
              name="pseudoname"
              value={user.pseudoname}
              onChange={handleInputChange}
            />
          </label>
        </div>
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
        <div>
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="button" onClick={handleInscription}>
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Inscription;
