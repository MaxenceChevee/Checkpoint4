const express = require("express");

const router = express.Router();

const userControllers = require("./controllers/userControllers");
/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import userControllers module for handling item-related operations

// Route to get a list of users
router.get("/users", userControllers.browse);

// Route to get a specific user by ID
router.get("/users/:id", userControllers.read);
router.get("/users/:id/field", userControllers.read);

router.put("/users/:id", userControllers.edit);

// Route to add a new user
router.post("/users", userControllers.add);
router.post("/login", userControllers.login);
// Route to delete an user by ID
router.delete("/users/:id", userControllers.destroy);

/* ************************************************************************* */

module.exports = router;
