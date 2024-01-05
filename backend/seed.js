// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config();

const database = require("./database/client");

const seed = async () => {
  try {
    const queries = [];

    /* ************************************************************************* */

    // Generating VIDEOS columns
    // queries.push(
    //   database.query(
    //     `INSERT INTO videos (link, title, description, categories_id, is_free) VALUES
    //     // ...
    //   `
    //   )
    // );

    // Generating USERS columns
    queries.push(
      database.query(
        `INSERT INTO users (firstname, lastname, pseudoname, mail, password) VALUES
        ('Admin', 'istrator', 'Administrator', 'administrator@email.com', 'admin'),
        ('Mode', 'rator', 'Moderator', 'moderator@email.com', 'rator'),
        ('Use', 'R', 'User', 'user@email.com', 'user'),
        ('Ex', 'ample', 'Example', 'example@email.com', 'example')
      `
      )
    );

    /* ************************************************************************* */

    // Wait for all the insertion queries to complete
    await Promise.all(queries);

    // Close the database connection
    database.end();

    console.info(`${database.databaseName} filled from ${__filename} 🌱`);
  } catch (err) {
    console.error("Error filling the database:", err.message);
  }
};

// Run the seed function
seed();
