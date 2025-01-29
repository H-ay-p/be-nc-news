const { fetchComments, addComment } = require("../models/commentsModel.js");

const getComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const newComment = req.body;
  const article_id = req.params.article_id;

  addComment(newComment, article_id)
    .then(() => {
      res.status(201).send(newComment.body);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getComments, postComment };

// comment_id
// votes
// created_at
// author
// body
// article_id
