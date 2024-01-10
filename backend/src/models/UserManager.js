const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "users" });
  }

  async create(user) {
    const { firstname, lastname, pseudoname, mail, password } = user;

    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (firstname, lastname, pseudoname, mail, password, credits) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, pseudoname, mail, password, 1000]
    );

    return result.insertId;
  }

  async getByMail(mail) {
    try {
      const [user] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE mail = ?`,
        [mail]
      );

      return user[0];
    } catch (error) {
      console.error("Error fetching user by mail:", error);
      throw error;
    }
  }

  async read(id, field) {
    if (field) {
      const [rows] = await this.database.query(
        `SELECT ?? FROM ${this.table} WHERE id = ?`,
        [field, id]
      );

      return rows.length === 0 ? null : rows[0][field];
    }

    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    return rows.length === 0 ? null : rows[0];
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async edit(id, user) {
    const { firstname, lastname, mail, password } = user;

    const [result] = await this.database.query(
      `UPDATE ${this.table} SET firstname = ?, lastname = ?, mail = ?, password = ? WHERE id = ?`,
      [firstname, lastname, mail, password, id]
    );

    return result.affectedRows;
  }

  async updateCredits(id, credits) {
    try {
      const [result] = await this.database.query(
        `UPDATE ${this.table} SET credits = ? WHERE id = ?`,
        [credits, id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Invalid credit operation: insufficient credits");
      }

      const [updatedUser] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id]
      );

      return updatedUser[0];
    } catch (error) {
      console.error("Error updating credits:", error);
      throw error;
    }
  }

  async delete(id) {
    await this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = UserManager;
