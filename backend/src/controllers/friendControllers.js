const friendManager = require("../models/FriendManager");
const notificationManager = require("../models/NotificationManager");
const friendRequestManager = require("../models/FriendRequestManager");

const getFriendsList = async (req, res) => {
  try {
    const { userId } = req.params;
    const friendsList = await friendManager.getFriendsList(userId);
    res.json(friendsList);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste d'amis :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const addFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { userId } = req.user;

    const friendExists = await friendManager.checkFriendExistence(
      userId,
      friendId
    );

    if (!friendExists) {
      await friendManager.addFriend(userId, friendId);
      await notificationManager.deleteFriendRequestNotification(
        userId,
        friendId
      );
      res.status(200).json({ message: "Ami ajouté avec succès" });
    } else {
      res.status(400).json({ error: "Cet utilisateur est déjà votre ami" });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ami :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const unfriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user;

    await friendManager.unfriend(userId, friendId);
    await friendRequestManager.deleteAllFriendRequestsBetweenUsers(
      userId,
      friendId
    );
    await notificationManager.deleteAllNotificationsBetweenUsers(
      userId,
      friendId
    );

    return res.status(200).json({ message: "Ami supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ami :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  getFriendsList,
  addFriend,
  unfriend,
};
