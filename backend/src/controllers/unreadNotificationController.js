const notificationManager = require("../models/NotificationManager");

const getUnreadNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationManager.getUnreadByUserId(userId);
    res.json({ notifications });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notifications non lues par utilisateur :",
      error
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  getUnreadNotificationsByUserId,
};
