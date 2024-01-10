const crypto = require("crypto");

// Génère une nouvelle clé secrète aléatoire
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Affiche la nouvelle clé secrète
console.info(generateSecretKey());
