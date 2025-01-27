const express = require("express");
const endpoints = require("./endpoints.json");
const app = express();

app.get("/api/healthcheck", (req, res) => {
  console.log("I am healthy");
  res.status(200).send("I am healthy");
});

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

module.exports = app;
