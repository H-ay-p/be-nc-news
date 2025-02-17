const db = require("../db/connection.js");

const fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes,
    articles.article_img_url, CAST(COUNT (comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON 
    articles.article_id = comments.article_id GROUP BY articles.article_id HAVING articles.article_id=$1`,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ message: "article not found" });
      } else {
        return response.rows;
      }
    });
};

const fetchArticles = (queries) => {
  const { sort_by, order, topic } = queries;

  let SQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    articles.article_img_url, CAST(COUNT (comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  let queryParams = [];

  if (topic) {
    SQLString += ` WHERE articles.topic=$1`;
    queryParams.push(topic);
  }

  SQLString += ` GROUP BY
    (articles.article_id) ORDER BY `;

  if (sort_by) {
    const validColumnNames = [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ];
    if (validColumnNames.includes(sort_by)) {
      SQLString += `${sort_by}`;
    } else {
      return Promise.reject({ message: "Bad Request" });
    }
  } else {
    SQLString += "created_at";
  }

  if (order) {
    if (order.toLowerCase() === "asc" || order.toLowerCase() === "desc") {
      SQLString += ` ${order}`;
    } else {
      return Promise.reject({ message: "Bad Request" });
    }
  } else {
    SQLString += ` DESC`;
  }

  return db.query(SQLString, queryParams).then((response) => {
    if (topic && response.rows.length === 0) {
      return Promise.reject({ message: "topic not available :(" });
    }
    return response.rows;
  });
};

const updateVotes = (voteInc, id) => {
  return db
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;`,
      [voteInc, id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ message: "Bad Request" });
      } else {
        return response.rows[0];
      }
    });
};

module.exports = { fetchArticleById, fetchArticles, updateVotes };
