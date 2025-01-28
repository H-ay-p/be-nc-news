const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topicsController.js");
// const getArticlesById = require("./controllers/articlesControllers.js");
// const getArticles = require("./controllers/articlesControllers.js");

const {
  getArticlesById,
  getArticles,
} = require("./controllers/articlesControllers.js");
// const {
//   fetchSnacks,
//   fetchSnackBySnackId,
//   addSnack,
// } = require("../models/snacks.models");

const app = express();

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

module.exports = app;
