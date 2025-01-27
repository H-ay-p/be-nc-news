const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topicsController.js");
const app = express();

app.get("/api/healthcheck", (req, res) => {
  console.log("I am healthy");
  res.status(200).send("I am healthy");
});

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/*");

app.use((err, req, res, next) => {
  console.log("in the err");
  console.log(err.status);
  if (err.status === 404) {
    res.status(404).send({ msg: "Bad request" });
  }
});

module.exports = app;
