const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const tables = require("../tables");

const secretKey = process.env.APP_SECRET;

const saltRounds = 10;

const login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await tables.users.getByMail(mail);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "password fail" });
    }

    const token = jwt.sign({ user: user.id }, secretKey);

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
    res.status(400).json({ message: error.message });
  }
};

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const users = await tables.users.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { field } = req.query;

    const user = await tables.users.read(id);

    if (field && user && user[field]) {
      res.json({ [field]: user[field] });
    } else if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation

const edit = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!req.body) {
      console.error("Empty body");
      return res.status(400).json({ message: "Empty body" });
    }

    const {
      currentPassword,
      firstname,
      lastname,
      mail,
      newPassword,
      pseudoname,
    } = req.body;

    const user = await tables.users.read(userId);

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword !== undefined && newPassword.trim() !== "") {
      const passwordMatch =
        currentPassword &&
        user.password &&
        (await bcrypt.compare(currentPassword.trim(), user.password.trim()));

      if (!passwordMatch) {
        console.error("Incorrect current password");
        return res.status(401).json({ message: "Incorrect current password" });
      }
    }

    const updatedFields = {};

    if (firstname !== undefined) {
      updatedFields.firstname = firstname;
    }

    if (lastname !== undefined) {
      updatedFields.lastname = lastname;
    }

    if (pseudoname !== undefined) {
      updatedFields.pseudoname = pseudoname;
    }

    if (mail !== undefined) {
      updatedFields.mail = mail;
    }

    if (newPassword !== undefined && newPassword.trim() !== "") {
      updatedFields.password = await bcrypt.hash(
        newPassword.trim(),
        saltRounds
      );
    }

    const affectedRows = await tables.users.edit(userId, updatedFields);

    if (affectedRows === 0) {
      console.error("Update fail");
      return res.status(500).json({ message: "Update fail" });
    }

    const editedUser = await tables.users.read(userId);

    return res.json({ message: "Updated", user: editedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user", error });
  }
};
// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  try {
    const { firstname, lastname, pseudoname, mail, password } = req.body;

    const existingUser = await tables.users.getByMail(mail);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Cette adresse e-mail est déjà enregistrée." });
    }

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
    return insertId;
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.users.delete(req.params.id);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
const checkWheelSpin = async (req, res) => {
  const userId = req.params.id;

  try {
    const canSpin = await tables.users.checkWheelSpin(userId);

    res.status(200).json({ canSpin });
  } catch (error) {
    console.error("Error checking wheel spin:", error);
    res.status(400).json({ message: "Roue déjà tourné" });
  }
};
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  login,
  updateCredits,
  checkWheelSpin,
};
