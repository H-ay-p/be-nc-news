const db = require("../db/connection.js");

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * from articles WHERE article_id=$1`, [id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ message: "article not found" });
      } else {
        return response.rows[0];
      }
    });
};

module.exports = fetchArticleById;
