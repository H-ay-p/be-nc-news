const db = require("../db/connection.js");

const fetchTopics = () => {
  return db.query("SELECT * from topics").then((response) => {
    return response.rows;
  });
};

module.exports = fetchTopics;
