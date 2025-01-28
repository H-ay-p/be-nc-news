const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topicsController.js");
const getArticlesById = require("./controllers/articlesControllers.js");
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

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not found!" });
});

module.exports = app;
