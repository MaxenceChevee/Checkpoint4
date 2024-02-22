const friendRequestManager = require("../models/FriendRequestManager");
const notificationManager = require("../models/NotificationManager");
const friendManager = require("../models/FriendManager");

const sendFriendRequest = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const { user: senderId } = req;

    if (!senderId || !toUserId) {
      return res.status(400).json({ error: "ID de l'utilisateur invalide" });
    }

    const existingRequest =
      await friendRequestManager.checkExistingFriendRequest(senderId, toUserId);

    if (existingRequest) {
      return res.status(400).json({
        error: "Une demande d'amitié existe déjà entre ces deux utilisateurs.",
      });
    }

    const requestId = await friendRequestManager.sendFriendRequest(
      senderId,
      toUserId
    );

    await notificationManager.createFriendRequestNotification(
      senderId,
      toUserId
    );
    return res.status(200).json({ requestId });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de l'envoi de la demande d'amitié" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const friendRequests = await friendRequestManager.getFriendRequests(
      toUserId
    );
    res.json(friendRequests);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes d'amitié :",
      error
    );
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = parseInt(req.query.userId, 10);

    if (!userId) {
      return res.status(400).json({ error: "ID de l'utilisateur invalide" });
    }

    const notification = await notificationManager.getNotification(
      notificationId
    );
    const senderId = notification.sender_id;

    await friendRequestManager.acceptFriendRequest(
      notificationId,
      senderId,
      userId
    );

    await notificationManager.sendFriendAcceptNotification(senderId, userId);

    await friendManager.addFriend(senderId, userId);

    return res
      .status(200)
      .json({ message: "Demande d'amitié acceptée avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de l'acceptation de la demande d'amitié :",
      error.message
    );
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user;

    const request = await friendRequestManager.getById(notificationId);
    if (!request) {
      console.error("La demande d'amitié n'existe pas.");
      return res
        .status(400)
        .json({ error: "La demande d'amitié n'existe pas." });
    }

    if (request.status !== "pending") {
      console.error("La demande d'amitié n'est pas en état 'pending'.");
      return res
        .status(400)
        .json({ error: "La demande d'amitié n'est pas en état 'pending'." });
    }

    if (Number(request.receiver_id) !== userId) {
      console.error(
        "La demande d'amitié n'est pas destinée à cet utilisateur."
      );
      return res.status(400).json({
        error: "La demande d'amitié n'est pas destinée à cet utilisateur.",
      });
    }

    await friendRequestManager.rejectFriendRequest(notificationId);
    await notificationManager.deleteFriendRequestNotification(
      request.sender_id,
      request.receiver_id
    );
    return res
      .status(200)
      .json({ message: "Demande d'amitié rejetée avec succès" });
  } catch (error) {
    console.error("Erreur lors du rejet de la demande d'amitié :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { user: userId } = req;

    const request = await friendRequestManager.getById(requestId);

    if (!request) {
      console.error("La demande d'amitié n'existe pas.");
      return res
        .status(400)
        .json({ error: "La demande d'amitié n'existe pas." });
    }

    if (request.status !== "pending") {
      console.error("La demande d'amitié n'est pas en état 'pending'.");
      return res
        .status(400)
        .json({ error: "La demande d'amitié n'est pas en état 'pending'." });
    }

    if (Number(request.sender_id) !== Number(userId)) {
      console.error(
        "La demande d'amitié n'est pas destinée à cet utilisateur."
      );
      return res.status(400).json({
        error: "La demande d'amitié n'est pas destinée à cet utilisateur.",
      });
    }

    await friendRequestManager.cancelFriendRequest(requestId, userId);

    await notificationManager.deleteFriendRequestNotification(
      request.sender_id,
      request.receiver_id
    );

    return res
      .status(200)
      .json({ message: "Demande d'amitié annulée avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de l'annulation de la demande d'amitié :",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
};
