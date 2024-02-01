require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const tables = require("../tables");

const resetTokenSecret = process.env.RESET_TOKEN_SECRET;
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
  .message("Le pseudo doit contenir au moins 3 caractères alphanumériques.");

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
    throw new Error("Ce pseudo est déjà pris.");
  }
};

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateResetToken = (user) => {
  const resetToken = jwt.sign({ user: user.id }, resetTokenSecret, {
    expiresIn: "1h",
  });

  const base64Token = Buffer.from(resetToken).toString("base64");

  return base64Token;
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: "Cash.Catalyst@outlook.com",
    to: user.mail,
    subject: "Réinitialisation de mot de passe",
    html: `
      <p>Bonjour ${user.firstname},</p>
      <p>Vous avez demandé une réinitialisation de mot de passe pour votre compte.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetLink}">Réinitialiser le mot de passe</a>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message.</p>
      <p>Merci,</p>
      <p>Votre équipe ${process.env.APP_NAME || "CashCatalyst"}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const forgottenPassword = async (req, res) => {
  const { mail } = req.body;

  try {
    const user = await tables.users.getByMail(mail);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const resetToken = generateResetToken(user);

    await sendPasswordResetEmail(user, resetToken);

    return res.status(200).json({
      message: "Envoi d'un e-mail de réinitialisation du mot de passe",
    });
  } catch (error) {
    console.error(
      "Erreur dans l'envoi de l'e-mail de réinitialisation du mot de passe:",
      error
    );
    return res.status(500).json({
      message:
        "Erreur dans l'envoi de l'e-mail de réinitialisation du mot de passe",
    });
  }
};
const resetPassword = async (req, res) => {
  const { password } = req.body;

  const resetToken = decodeURIComponent(req.params.token);

  try {
    const decodedToken = jwt.verify(resetToken, resetTokenSecret);

    const user = await tables.users.read(decodedToken.user);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!password) {
      return res.status(400).json({ message: "Nouveau mot de passe manquant" });
    }

    const { error } = Joi.string()
      .min(8)
      .regex(/[A-Z]/)
      .message("Le mot de passe doit contenir au moins une majuscule.")
      .regex(/\d/)
      .message("Le mot de passe doit contenir au moins un chiffre.")
      .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/)
      .message("Le mot de passe doit contenir au moins un caractère spécial.")
      .validate(password);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await tables.users.edit(user.id, { password: hashedPassword });

    return res
      .status(200)
      .json({ message: "Réinitialisation du mot de passe réussie" });
  } catch (error) {
    console.error("Erreur de réinitialisation du mot de passe:", error);
    return res.status(500).json({
      message: "Erreur de réinitialisation du mot de passe",
      error,
    });
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
        errors.pseudoname = "Le pseudo ne peut pas être vide";
      } else if (pseudoname.trim() !== user.pseudoname.trim()) {
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
      return res.status(400).json({ message: "Ce pseudo est déjà pris." });
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
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", err);
    return next(err);
  }
};

const destroy = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        errors: {
          currentPassword:
            "Le mot de passe actuel est requis pour la suppression du compte.",
        },
      });
    }

    const user = await tables.users.getById(userId);

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        errors: {
          currentPassword: "Le mot de passe actuel est incorrect.",
        },
      });
    }

    await tables.users.delete(userId);

    res.sendStatus(204);
  } catch (err) {
    console.error("Erreur lors de la suppression du compte :", err);

    res.status(500).json({
      errors: {
        general: "Une erreur s'est produite lors de la suppression du compte.",
      },
    });
  }

  return Promise.resolve();
};

const checkWheelSpin = async (req, res) => {
  const userId = req.params.id;

  try {
    const canSpin = await tables.users.checkWheelSpin(userId);

    res.status(200).json({ canSpin });
  } catch (error) {
    console.error("Error checking wheel spin:", error);
    res.status(400).json({
      message: "Vous avez déjà tourné la roue aujourd'hui, revenez demain!",
    });
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
  forgottenPassword,
  resetPassword,
};
