// verifyToken.js
const jwt = require("jsonwebtoken");

const secretKey = process.env.APP_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
    return null; // Ajoutez un return null ici
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
