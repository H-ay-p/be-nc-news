const db = require("../db/connection.js");

const fetchUsers = () => {
  return db.query("SELECT * from users").then((response) => {
    return response.rows;
  });
};

module.exports = fetchUsers;
