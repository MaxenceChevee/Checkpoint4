const notificationManager = require("../models/NotificationManager");

const getReadNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationManager.getReadByUserId(userId);
    res.json({ notifications });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notifications lues par utilisateur :",
      error
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  getReadNotificationsByUserId,
};
