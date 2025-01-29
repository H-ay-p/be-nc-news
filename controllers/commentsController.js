const fetchComments = require("../models/commentsModel");

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

module.exports = getComments;

// comment_id
// votes
// created_at
// author
// body
// article_id
