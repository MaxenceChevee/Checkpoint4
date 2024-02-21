const AbstractManager = require("./AbstractManager");
const UserManager = require("./UserManager");

class GiftManager extends AbstractManager {
  constructor() {
    super({ table: "gift_transactions" });
    this.userManager = new UserManager();
  }

  async createGiftTransaction(senderId, receiverId, creditsAmount) {
    try {
      const MINIMUM_CREDITS = 20;
      const MAXIMUM_CREDITS = 200;
      const ROUNDING_FACTOR = 10;
      const MINIMUM_BALANCE = 100;

      const sender = await this.userManager.getById(senderId);
      if (sender.credits < MINIMUM_BALANCE) {
        throw new Error(
          "Solde insuffisant. Vous devez disposer d'au moins 100 $ pour envoyer un cadeau."
        );
      }

      const roundedAmount =
        Math.round(creditsAmount / ROUNDING_FACTOR) * ROUNDING_FACTOR;

      if (roundedAmount < MINIMUM_CREDITS || roundedAmount > MAXIMUM_CREDITS) {
        throw new Error(
          "Montant du crédit non valide. Vous ne pouvez envoyer qu'un montant compris entre 20 et 200 dollars, arrondi à la dizaine la plus proche."
        );
      }

      if (!(await this.checkGiftLimit(senderId, receiverId))) {
        throw new Error(
          "Limite de cadeaux atteinte. Vous ne pouvez envoyer qu'un seul cadeau par jour."
        );
      }

      await this.decrementUserCredits(senderId, roundedAmount);

      await this.incrementUserCredits(receiverId, roundedAmount);

      await this.create({
        sender_id: senderId,
        receiver_id: receiverId,
        credits_amount: roundedAmount,
        transaction_date: new Date(),
      });
    } catch (error) {
      console.error("Error creating gift transaction:", error);
      throw error;
    }
  }

  async decrementUserCredits(userId, amount) {
    try {
      if (Number.isNaN(amount)) {
        throw new Error("Invalid credits amount: NaN");
      }

      const user = await this.userManager.getById(userId);
      const currentCredits = user.credits;

      if (currentCredits < amount) {
        throw new Error("Insufficient credits");
      }

      const updatedCredits = currentCredits - amount;
      await this.userManager.updateCredits(userId, updatedCredits);
    } catch (error) {
      console.error("Error decrementing user credits:", error);
      throw error;
    }
  }

  async incrementUserCredits(userId, amount) {
    try {
      if (Number.isNaN(amount)) {
        throw new Error("Invalid credits amount: NaN");
      }

      const user = await this.userManager.getById(userId);
      const currentCredits = user.credits;

      const updatedCredits = currentCredits + amount;
      await this.userManager.updateCredits(userId, updatedCredits);
    } catch (error) {
      console.error("Error incrementing user credits:", error);
      throw error;
    }
  }

  async checkGiftLimit(senderId, receiverId) {
    try {
      const [lastGift] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE sender_id = ? AND receiver_id = ? ORDER BY transaction_date DESC LIMIT 1`,
        [senderId, receiverId]
      );

      if (!lastGift || lastGift.length === 0) {
        return true;
      }

      const lastGiftDate = new Date(lastGift[0].transaction_date);
      const today = new Date();

      if (today - lastGiftDate >= 24 * 60 * 60 * 1000) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking gift limit:", error);
      throw error;
    }
  }
}

module.exports = GiftManager;
