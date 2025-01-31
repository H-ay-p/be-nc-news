const {
  fetchArticleById,
  fetchArticles,
  updateVotes,
} = require("../models/articlesModels.js");

const getArticlesById = (req, res, next) => {
  const article_id = req.params.article_id;

  if (typeof Number(article_id) === "number") {
    fetchArticleById(article_id)
      .then((article) => {
        res.status(200).send(article[0]);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(400).send({ message: "invalid article id" });
  }
};

const getArticles = (req, res, next) => {
  const queries = req.query;
  fetchArticles(queries)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

const patchVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  const voteInc = req.body.incVotes;

  updateVotes(voteInc, article_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticlesById, patchVotes };
