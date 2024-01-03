import { useState } from "react";
import "../styles/Inscription.scss";

const Inscription = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");

  const handleInscription = (e) => {
    e.preventDefault();

    console.error("Message d'erreur");
    console.warn("Message d'avertissement");
    console.info("Message d'information");
  };

  return (
    <div className="form-container">
      <h2>Inscription</h2>
      <form onSubmit={handleInscription}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Dupont"
          />
        </div>
        <div>
          <label htmlFor="prenom">Prénom :</label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Antoine"
          />
        </div>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@email.com"
          />
        </div>
        <div>
          <label htmlFor="motDePasse">Mot de passe :</label>
          <input
            type="password"
            id="motDePasse"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Au moins 6 caractères"
          />
        </div>
        <div>
          <label htmlFor="dateNaissance">Date de naissance :</label>
          <input
            type="text"
            id="dateNaissance"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            placeholder="JJ/MM/AAAA"
          />
        </div>
        <button className="button-register" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Inscription;
