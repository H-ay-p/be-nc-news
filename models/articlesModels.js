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

const fetchArticles = () => {
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY
    articles.article_id ORDER BY articles.created_at DESC`;
  return db.query(queryString).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "no articles to be found" });
    } else {
      return response.rows;
    }
  });
};

module.exports = { fetchArticleById, fetchArticles };
