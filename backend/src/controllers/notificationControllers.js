const notificationManager = require("../models/NotificationManager");

const createFriendRequestNotification = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    await notificationManager.createFriendRequestNotification(
      senderId,
      receiverId
    );
    res.status(200).json({ message: "Notification créée avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la notification liée à la demande d'amitié :",
      error
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationManager.getByUserId(userId);
    res.json({ notifications });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notifications par utilisateur :",
      error
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationManager.markAsRead(notificationId);
    res
      .status(200)
      .json({ message: "Notification marquée comme lue avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors du marquage de la notification comme lue :",
      error
    );
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res
        .status(400)
        .json({ message: "L'ID de la notification est manquant." });
    }
    await notificationManager.delete(notificationId);
    return res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
  createFriendRequestNotification,
};
