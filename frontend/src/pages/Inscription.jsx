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
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleInscription = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3310/api/users",
        user
      );
      setRegistrationStatus("Vous êtes bien inscrit");
      // eslint-disable-next-line no-restricted-syntax
      console.log(response.data);
    } catch (error) {
      console.error("Error during registration:", error);
      setRegistrationStatus("Erreur lors de l'inscription");
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
        <button type="button" onClick={handleInscription}>
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Inscription;
