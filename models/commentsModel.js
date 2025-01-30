const db = require("../db/connection.js");

const fetchComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;`,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ message: "no comments :(" });
      } else {
        return response.rows;
      }
    });
};

const addComment = (newComment, id) => {
  newComment.article_id = id;
  const { body, username, article_id } = newComment;
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, article_id]
    )

    .then(({ rows }) => {
      return rows[0];
    });
};

const deleteCommentModel = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1;`, [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ message: "no comment with this id" });
      } else {
        return "comment deleted";
      }
    });
};

module.exports = { fetchComments, addComment, deleteCommentModel };
