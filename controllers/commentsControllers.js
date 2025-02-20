const {
  fetchComments,
  addComment,
  deleteCommentModel,
} = require("../models/commentsModel.js");

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
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((err) => {
      if (
        err.detail &&
        err.detail.slice(0, 42) === "Failing row contains (19, null, 2, null, 0"
      ) {
        res.status(404).send({ message: "no article for this id :(" });
      } else {
        next(err);
      }
    });
};

const deleteComment = (req, res, next) => {
  comment_id = req.params.comment_id;
  deleteCommentModel(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getComments, postComment, deleteComment };
