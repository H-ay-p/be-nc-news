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

  let SQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY
    articles.article_id ORDER BY`;
  const args = [];

  console.log(queries, "in the model");

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
      SQLString += ` ${sort_by}`;
    } else {
      return Promise.reject({ message: "invalid sort parameter" });
    }
  } else {
    SQLString += " created_at";
  }

  if (order) {
    console.log("it has an order");
    SQLString += ` ${order}`;
  } else {
    SQLString += ` DESC`;
  }

  // let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
  // articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY
  // articles.article_id ORDER BY articles.created_at DESC`;

  console.log(SQLString);
  return db.query(SQLString).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ message: "no articles to be found" });
    } else {
      return response.rows;
    }
  });
};

// const sort_by = queries.sort_by;
// const order = queries.order;

// let SQLString = `SELECT * FROM snacks`; // Start with a basic string
// const args = [];

// if (sort_by) {
//   const validColumnNamesToSortBy = ["price_in_pence", "category_id"]; // sanitising input via a greenlist
//   if (validColumnNamesToSortBy.includes(sort_by)) {
//     SQLString += ` ORDER BY ${sort_by}`;
//   }

//   if (order === "desc" || order === "asc") {
//     SQLString += " " + order;
//   }
// }

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
