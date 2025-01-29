const db = require("../db/connection.js");

const fetchComments = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id=$1;`, [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ message: "no comments :(" });
      } else {
        return response.rows;
      }
    });
};

module.exports = fetchComments;
