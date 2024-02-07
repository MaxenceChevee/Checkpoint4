const AbstractManager = require("./AbstractManager");
const notificationManager = require("./NotificationManager");
const friendManager = require("./FriendManager");

class FriendRequestManager extends AbstractManager {
  constructor() {
    super({ table: "friend_requests" });
  }

  async sendFriendRequest(senderId, receiverId) {
    try {
      const existingRequest = await this.checkExistingFriendRequest(
        senderId,
        receiverId
      );

      if (existingRequest) {
        throw new Error(
          "Une demande d'amitié existe déjà entre ces deux utilisateurs."
        );
      }

      const [result] = await this.database.query(
        "INSERT INTO `friend_requests` (sender_id, receiver_id) VALUES (?, ?)",
        [senderId, receiverId]
      );

      const requestId = result.insertId;

      return requestId;
    } catch (error) {
      console.error("Error sending friend request:", error.message);
      throw new Error("Erreur lors de l'envoi de la demande d'amitié");
    }
  }

  async checkExistingFriendRequest(senderId, receiverId) {
    try {
      const [result] = await this.database.query(
        "SELECT COUNT(*) AS count FROM friend_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
        [senderId, receiverId, receiverId, senderId]
      );

      const { count } = result[0];
      return count > 0;
    } catch (error) {
      console.error("Error checking existing friend request:", error);
      throw error;
    }
  }

  async getFriendRequests(userId) {
    try {
      const [friendRequests] = await this.database.query(
        "SELECT * FROM friend_requests WHERE receiver_id = ? AND status = 'pending'",
        [userId]
      );

      const formattedFriendRequests = friendRequests.map((request) => ({
        id: request.id,
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: request.status,
      }));

      return formattedFriendRequests;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des demandes d'amitié :",
        error
      );
      throw new Error("Erreur interne du serveur");
    }
  }

  async acceptFriendRequest(notificationId, senderId, receiverId) {
    try {
      await this.database.query(
        "UPDATE friend_requests SET status = 'accepted' WHERE sender_id = ? AND receiver_id = ?",
        [senderId, receiverId]
      );

      await notificationManager.delete(notificationId);

      await friendManager.addFriend(senderId, receiverId);
    } catch (error) {
      console.error(
        "Erreur lors de l'acceptation de la demande d'amitié :",
        error
      );
      throw error;
    }
  }

  async rejectFriendRequest(requestId) {
    try {
      await this.database.query(
        "UPDATE friend_requests SET status = 'rejected' WHERE id = ?",
        [requestId]
      );
    } catch (error) {
      console.error("Erreur lors du rejet de la demande d'amitié :", error);
      throw new Error("Erreur interne du serveur");
    }
  }

  async cancelFriendRequest(requestId, userId) {
    try {
      const request = await this.getById(requestId);

      if (!request) {
        throw new Error("La demande d'amitié n'existe pas.");
      }

      if (request.status !== "pending") {
        throw new Error("La demande d'amitié n'est pas en état 'pending'.");
      }

      if (Number(request.sender_id) !== Number(userId)) {
        console.error(
          "La demande d'amitié n'est pas destinée à cet utilisateur."
        );
        throw new Error(
          "La demande d'amitié n'est pas destinée à cet utilisateur."
        );
      }

      await this.database.query(
        "DELETE FROM friend_requests WHERE id = ?",
        requestId
      );
    } catch (error) {
      console.error(
        "Erreur lors de l'annulation de la demande d'amitié :",
        error
      );
      throw error;
    }
  }
}

module.exports = new FriendRequestManager();
