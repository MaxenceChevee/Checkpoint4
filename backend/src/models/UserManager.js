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

  async edit(id, updatedFields) {
    const allowedFields = [
      "firstname",
      "lastname",
      "mail",
      "password",
      "pseudoname",
    ];

    const fieldsToUpdate = Object.keys(updatedFields).filter((field) =>
      allowedFields.includes(field)
    );

    const updateValues = fieldsToUpdate.map((field) => updatedFields[field]);

    if (fieldsToUpdate.length === 0) {
      return 0;
    }

    const updateQuery = `UPDATE ${this.table} SET ${fieldsToUpdate
      .map((field) => `${field} = ?`)
      .join(", ")} WHERE id = ?`;

    updateValues.push(id);

    const [result] = await this.database.query(updateQuery, updateValues);

    return result.affectedRows;
  }

  async updateCredits(id, credits) {
    try {
      const [result] = await this.database.query(
        `UPDATE ${this.table} SET credits = ?, last_wheel_spin = CURRENT_TIMESTAMP WHERE id = ?`,
        [credits, id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Opération de crédit invalide : crédits insuffisants");
      }

      const [updatedUser] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id]
      );

      return updatedUser[0];
    } catch (error) {
      console.error("Erreur lors de la mise à jour des crédits :", error);
      throw error;
    }
  }

  async delete(id) {
    await this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }

  async checkWheelSpin(userId) {
    const user = await this.read(userId);

    const lastWheelSpin = user.last_wheel_spin;
    if (lastWheelSpin && new Date() - lastWheelSpin < 24 * 60 * 60 * 1000) {
      throw new Error("La roue peut être tournée une fois par jour.");
    }
    return true;
  }
}

module.exports = UserManager;
