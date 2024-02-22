const GiftManager = require("../models/GiftManager");

const sendGift = async (req, res) => {
  try {
    const { senderId, receiverId, creditsAmount } = req.body;

    if (!senderId || !receiverId || Number.isNaN(creditsAmount)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const amount = parseFloat(creditsAmount);

    if (Number.isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid credits amount" });
    }

    const giftManager = new GiftManager();

    const sender = await giftManager.userManager.getById(senderId);
    if (sender.credits < 100) {
      return res.status(400).json({
        message:
          "Solde insuffisant. Vous devez disposer d'au moins 100 $ pour envoyer un cadeau.",
      });
    }

    if (sender.credits - amount < 0) {
      return res.status(400).json({
        message: "Vous ne pouvez pas descendre en dessous de 0 crédit.",
      });
    }

    await giftManager.createGiftTransaction(senderId, receiverId, amount);

    return res.status(200).json({ message: "Cadeau envoyé avec succès" });
  } catch (error) {
    if (
      error.message ===
      "Montant du crédit non valide. Vous ne pouvez envoyer qu'un montant compris entre 20 et 200 dollars, arrondi à la dizaine la plus proche."
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (
      error.message ===
      "Limite de cadeaux atteinte. Vous ne pouvez envoyer qu'un seul cadeau par jour."
    ) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Erreur dans l'envoi du cadeau :", error);
    return res.status(500).json({ message: "Erreur de serveur interne" });
  }
};

module.exports = {
  sendGift,
};
