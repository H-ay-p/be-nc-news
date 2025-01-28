const fetchArticleById = require("../models/articlesModels.js");

const getArticlesById = (req, res) => {
  const article_id = req.params.article_id;

  fetchArticleById(article_id).then((article) => {
    res.status(200).send(article);
  });
  // .catch((err) => {
  //   console.log("in the error catch");
  //   next(err);
  // });
};

module.exports = getArticlesById;
