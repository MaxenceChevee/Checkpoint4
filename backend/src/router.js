// routes.js
const express = require("express");

const verifyToken = require("./controllers/verifyToken");

const router = express.Router();
const userControllers = require("./controllers/userControllers");

// Routes publiques
router.post("/login", userControllers.login);

router.get("/users", verifyToken, userControllers.browse);
router.get("/users/:id", userControllers.read);
router.put("/users/:id", userControllers.edit);
router.post("/users", userControllers.add);
router.put("/users/:id/credits", verifyToken, userControllers.updateCredits);
router.delete("/users/:id", userControllers.destroy);

module.exports = router;
