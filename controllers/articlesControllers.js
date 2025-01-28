const {
  fetchArticleById,
  fetchArticles,
} = require("../models/articlesModels.js");

const getArticlesById = (req, res, next) => {
  const article_id = req.params.article_id;

  if (typeof Number(article_id) === "number") {
    fetchArticleById(article_id)
      .then((article) => {
        res.status(200).send(article);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(400).send({ message: "invalid article id" });
  }
};

const getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send(articles);
  });
};

module.exports = { getArticles, getArticlesById };
