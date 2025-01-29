const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topicsController.js");

const {
  getComments,
  postComment,
} = require("./controllers/commentsController.js");
const {
  getArticlesById,
  getArticles,
} = require("./controllers/articlesControllers.js");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", (req, res) => {
  console.log("I am healthy");
  res.status(200).send("I am healthy");
});

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not found!" });
});

app.use((err, req, res, next) => {
  if (err.message === "article not found") {
    res.status(404).send({ message: "article not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Parameter not valid" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "no comments :(") {
    res.status(404).send({ message: "no comments :(" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    // res.status(400).send({ message: "Bad Request" });
    res.status(400).send("Bad Request");
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "ERR_HTTP_INVALID_STATUS_CODE") {
    // res.status(400).send({ message: "Bad Request" });
    res.status(400).send("Bad Request - incorrect data types");
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    // res.status(400).send({ message: "Bad Request" });
    res.status(400).send("Bad Request - no user found");
  } else {
    next(err);
  }
});

module.exports = app;
