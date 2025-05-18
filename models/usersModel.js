const db = require("../db/connection.js");

const fetchUsers = () => {
  return db.query("SELECT * from users").then((response) => {
    return response.rows;
  });
};

const fetchUserByUsername = (username) => {
  return db
    .query("SELECT * from users where username = $1", username)
    .then((response) => {
      return response.rows;
    });
};

module.exports = fetchUsers;
