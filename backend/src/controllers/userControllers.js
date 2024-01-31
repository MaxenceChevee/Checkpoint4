const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const tables = require("../tables");

const secretKey = process.env.APP_SECRET;
const saltRounds = 10;

const passwordSchema = Joi.string()
  .min(8)
  .regex(/[A-Z]/)
  .message("Le mot de passe doit contenir au moins une majuscule.")
  .regex(/\d/)
  .message("Le mot de passe doit contenir au moins un chiffre.")
  .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/)
  .message("Le mot de passe doit contenir au moins un caractère spécial.");

const pseudonameSchema = Joi.string()
  .alphanum()
  .min(3)
  .message(
    "Le pseudonyme doit contenir au moins 3 caractères alphanumériques."
  );

const emailSchema = Joi.string().email().message("Format d'e-mail invalide.");

const validatePasswordComplexity = async (password) => {
  await passwordSchema.validateAsync(password);
};

const validateEmail = async (email) => {
  await emailSchema.validateAsync(email);
};

const validateUniquePseudoname = async (pseudoname) => {
  await pseudonameSchema.validateAsync(pseudoname);
  const existingUserByPseudoname = await tables.users.getByPseudoname(
    pseudoname
  );

  if (existingUserByPseudoname) {
    throw new Error("Ce pseudonyme est déjà pris.");
  }
};
const login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await tables.users.getByMail(mail);

    if (!user) {
      return res.status(401).json({ message: "Adresse email introuvable" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ user: user.id }, secretKey);

    return res.status(200).json({
      message: "Connexion réussie",
      user: { ...user, credits: user.credits },
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
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

const browse = async (req, res, next) => {
  try {
    const users = await tables.users.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

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

const edit = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!req.body) {
      return res.status(400).json({ message: "Corps de la requête vide" });
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
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }

    const errors = {};

    if (firstname !== undefined && firstname.trim() === "") {
      errors.firstname = "Le prénom ne peut pas être vide";
    }

    if (lastname !== undefined && lastname.trim() === "") {
      errors.lastname = "Le nom ne peut pas être vide";
    }

    if (pseudoname !== undefined) {
      if (pseudoname.trim() === "") {
        errors.pseudoname = "Le pseudonyme ne peut pas être vide";
      } else {
        try {
          await validateUniquePseudoname(pseudoname);
        } catch (error) {
          errors.pseudoname = error.message;
        }
      }
    }

    if (mail !== undefined && mail.trim() === "") {
      errors.mail = "L'e-mail ne peut pas être vide";
    }

    if (newPassword !== undefined && newPassword.trim() !== "") {
      try {
        await validatePasswordComplexity(newPassword.trim());
      } catch (error) {
        errors.newPassword = error.message;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
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
      return res.status(500).json({ message: "Échec de la mise à jour" });
    }

    const editedUser = await tables.users.read(userId);

    return res.json({ message: "Mis à jour", user: editedUser });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
};

const add = async (req, res, next) => {
  try {
    const { firstname, lastname, pseudoname, mail, password, confirmPassword } =
      req.body;

    const existingUserByMail = await tables.users.getByMail(mail);
    if (existingUserByMail) {
      return res
        .status(400)
        .json({ message: "Cette adresse e-mail est déjà enregistrée." });
    }

    const existingUserByPseudoname = await tables.users.getByPseudoname(
      pseudoname
    );
    if (existingUserByPseudoname) {
      return res.status(400).json({ message: "Ce pseudonyme est déjà pris." });
    }

    await validateEmail(mail);

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
      await passwordSchema.validateAsync(password);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
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
    console.error("Error during user registration:", err);
    return next(err);
  }
};

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
    res.status(400).json({ message: "Roue déjà tournée" });
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
