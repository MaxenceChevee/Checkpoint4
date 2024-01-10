const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tables = require("../tables");

const secretKey = process.env.APP_SECRET;

const saltRounds = 10; // Vous pouvez ajuster le nombre selon vos besoins

const login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    // Fetch user from the database based on email
    const user = await tables.users.getByMail(mail);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "password fail" });
    }

    // Generate JWT token with username and credits
    const token = jwt.sign({ user: user.id }, secretKey);

    // Respond with successful login, user details, and token
    return res.status(200).json({
      message: "Login successful",
      user: { ...user, credits: user.credits },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;

    const updatedUser = await tables.users.updateCredits(id, credits);

    res.status(200).json({
      message: "Crédits mis à jour avec succès",
      user: {
        id: updatedUser.id,
        credits: updatedUser.credits,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des crédits :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour des crédits" });
  }
};

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await tables.users.readAll();
    // Respond with the users in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { field } = req.query;

    // Fetch a specific user from the database based on the provided ID
    const user = await tables.users.read(id);

    // If the field parameter is present, respond with the specific field
    if (field && user && user[field]) {
      res.json({ [field]: user[field] });
    } else if (user) {
      // If the user is not found, respond with HTTP 404 (Not Found)
      // Otherwise, respond with the user in JSON format
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if req.body is defined
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Le corps de la requête est vide." });
    }

    const { firstname, lastname, mail, password, credits } = req.body;

    // Edit user information directly using UserManager
    const affectedRows = await tables.users.edit(userId, {
      firstname,
      lastname,
      mail,
      password,
      credits,
    });

    if (affectedRows === 0) {
      return res.status(500).json({ message: "La mise à jour a échoué" });
    }

    // Fetch and return the updated user
    const editedUser = await tables.users.read(userId);
    return res.json({ message: "Mise à jour réussie", user: editedUser });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  try {
    const { firstname, lastname, pseudoname, mail, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = {
      firstname,
      lastname,
      pseudoname,
      mail,
      password: hashedPassword,
      credits: 1000,
    };

    const insertId = await tables.users.create(user);

    const token = jwt.sign({ user: user.id }, secretKey);

    res.status(201).json({ insertId, token });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    // Delete the user from the database
    await tables.users.delete(req.params.id);

    // Respond with HTTP 204 (No Content)
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  login,
  updateCredits,
};
