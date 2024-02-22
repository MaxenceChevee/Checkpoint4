const AbstractManager = require("./AbstractManager");
const friendRequestManager = require("./FriendRequestManager");

class NotificationManager extends AbstractManager {
  constructor() {
    super({ table: "notifications" });
  }

  async createGiftNotification(senderId, receiverId, creditsAmount) {
    try {
      const notificationData = {
        user_id: receiverId,
        sender_id: senderId,
        type: "gift",
        content: `Vous avez reçu un cadeau de ${senderId} : ${creditsAmount} crédits.`,
        credits_amount: creditsAmount,
      };
      await this.create(notificationData);
    } catch (error) {
      console.error(
        "Erreur lors de la création de la notification pour le cadeau :",
        error
      );
      throw error;
    }
  }

  async createFriendRequestNotification(senderId, receiverId) {
    try {
      const notificationData = {
        user_id: receiverId,
        sender_id: senderId,
        type: "friend_request",
      };
      await this.create(notificationData);
    } catch (error) {
      console.error(
        "Erreur lors de la création de la notification liée à la demande d'amitié :",
        error
      );
      throw error;
    }
  }

  async handleFriendRequestAccept(notificationId, userId) {
    try {
      const notification = await this.getById(notificationId);
      if (
        !notification ||
        notification.type !== "friend_request" ||
        notification.user_id !== userId
      ) {
        throw new Error(
          "La notification n'existe pas ou n'est pas destinée à cet utilisateur."
        );
      }
      const newFriendId = await friendRequestManager.acceptFriendRequest(
        notification.sender_id,
        notification.user_id
      );
      await this.markAsRead(notificationId);
      await this.sendFriendAcceptNotification(
        notification.sender_id,
        notification.user_id
      );
      await this.deleteFriendRequestNotification(
        notification.sender_id,
        notification.user_id
      );
      return newFriendId;
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'acceptation de la demande d'amitié :",
        error
      );
      throw error;
    }
  }

  async sendFriendAcceptNotification(senderId, receiverId) {
    try {
      const notificationData = {
        user_id: senderId,
        sender_id: receiverId,
        type: "friend_accept",
        content: `Votre demande d'ami a été acceptée par l'utilisateur avec l'ID ${senderId}.`,
      };
      await this.create(notificationData);
    } catch (error) {
      console.error(
        "Erreur lors de la création et de l'envoi de la notification d'acceptation d'ami :",
        error
      );
      throw error;
    }
  }

  async getNotification(notificationId) {
    try {
      const [notification] = await this.database.query(
        "SELECT * FROM notifications WHERE id = ?",
        [notificationId]
      );
      return notification[0];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la notification :",
        error
      );
      throw error;
    }
  }

  async getUnreadByUserId(userId) {
    try {
      const [rawNotifications] = await this.database.query(
        "SELECT n.*, u.pseudoname as sender_pseudoname, n.credits_amount FROM notifications n JOIN users u ON n.sender_id = u.id WHERE n.user_id = ? AND n.status = 'unread'",
        [userId]
      );
      const notifications = rawNotifications.map((notification) => ({
        id: notification.id,
        user_id: notification.user_id,
        sender_id: notification.sender_id,
        sender_pseudoname: notification.sender_pseudoname,
        type: notification.type,
        status: notification.status,
        credits_amount: notification.credits_amount,
      }));
      return notifications;
    } catch (error) {
      console.error("Error fetching unread notifications for user:", error);
      throw error;
    }
  }

  async getReadByUserId(userId) {
    try {
      const [rawNotifications] = await this.database.query(
        "SELECT n.*, u.pseudoname as sender_pseudoname, n.credits_amount FROM notifications n JOIN users u ON n.sender_id = u.id WHERE n.user_id = ? AND n.status = 'read'",
        [userId]
      );
      const notifications = rawNotifications.map((notification) => ({
        id: notification.id,
        user_id: notification.user_id,
        sender_id: notification.sender_id,
        sender_pseudoname: notification.sender_pseudoname,
        type: notification.type,
        status: notification.status,
        credits_amount: notification.credits_amount,
      }));
      return notifications;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des notifications lues par utilisateur :",
        error
      );
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      await this.database.query(
        "UPDATE notifications SET status = 'read' WHERE id = ?",
        [notificationId]
      );
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la notification comme lue :",
        error
      );
      throw error;
    }
  }

  async deleteFriendRequestNotification(senderId, receiverId) {
    try {
      const [notification] = await this.database.query(
        "SELECT * FROM notifications WHERE user_id = ? AND sender_id = ? AND type = 'friend_request'",
        [receiverId, senderId]
      );

      if (notification.length > 0) {
        await this.delete(notification[0].id);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la notification de demande d'amitié :",
        error
      );
      throw error;
    }
  }

  async delete(notificationId) {
    try {
      await this.database.query(
        "DELETE FROM notifications WHERE id = ?",
        notificationId
      );
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la notification :",
        error
      );
      throw error;
    }
  }

  async deleteAllNotificationsBetweenUsers(userId1, userId2) {
    try {
      await this.database.query(
        "DELETE FROM notifications WHERE (user_id = ? AND sender_id = ?) OR (user_id = ? AND sender_id = ?)",
        [userId1, userId2, userId2, userId1]
      );
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications :", error);
      throw error;
    }
  }
}

module.exports = new NotificationManager();
