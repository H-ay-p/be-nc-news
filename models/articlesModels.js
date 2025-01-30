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

const fetchArticles = (queries) => {
  const sort_by = queries.sort_by;
  const order = queries.order;
  const topic = queries.topic;

  let SQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    //THIS LOOKS MESSY BUT WHEN I TRIED TO STICK THEM ALL TOGETHER IT IGNORED ALL THE WORDS EXCEPT MITCH
    SQLString += ` WHERE `;
    SQLString += `articles.topic = `;
    SQLString += `'` + (`$1;`, [topic]) + `'`;
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

  return db.query(SQLString).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "no articles to be found" });
    } else {
      return response.rows;
    }
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
