const database = require("../../database/client");

class AbstractManager {
  constructor({ table }) {
    this.table = table;

    this.database = database;
  }

  async getById(id) {
    try {
      const [result] = await this.database.query(
        "SELECT * FROM ?? WHERE id = ?",
        [this.table, id]
      );

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      console.error("Error getting entity by ID:", error);
      throw error;
    }
  }

  async create(data) {
    try {
      const [result] = await this.database.query(
        `INSERT INTO \`${this.table}\` SET ?`,
        data
      );

      return result.insertId;
    } catch (error) {
      console.error("Error creating entity:", error);
      throw error;
    }
  }
}

module.exports = AbstractManager;
