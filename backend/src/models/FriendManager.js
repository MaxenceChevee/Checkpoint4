const AbstractManager = require("./AbstractManager");

class FriendManager extends AbstractManager {
  constructor() {
    super({ table: "friends" });
  }

  async getFriendsList(userId) {
    try {
      const friendsList = await this.database.query(
        "SELECT DISTINCT u.id, u.firstname, u.lastname, u.pseudoname, u.mail, u.password, u.credits, u.last_wheel_spin FROM friends f JOIN users u ON (f.user1_id = u.id OR f.user2_id = u.id) WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ?",
        [userId, userId, userId]
      );

      return friendsList;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste d'amis :",
        error
      );
      throw error;
    }
  }

  async addFriend(user1Id, user2Id) {
    try {
      await this.database.query(
        "INSERT INTO friends (user1_id, user2_id) VALUES (?, ?)",
        [user1Id, user2Id]
      );

      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ami :", error);
      throw error;
    }
  }

  async checkFriendExistence(user1Id, user2Id) {
    try {
      const [result] = await this.database.query(
        "SELECT COUNT(*) AS count FROM friends WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
        [user1Id, user2Id, user2Id, user1Id]
      );

      const { count } = result;
      return count > 0;
    } catch (error) {
      console.error("Error checking friend existence:", error);
      throw error;
    }
  }

  async unfriend(user1Id, user2Id) {
    try {
      await this.database.query(
        "DELETE FROM friends WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
        [user1Id, user2Id, user2Id, user1Id]
      );

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ami :", error);
      throw error;
    }
  }
}

module.exports = new FriendManager();
