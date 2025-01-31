const express = require("express");
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topicsController.js");

const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/commentsControllers.js");
const {
  getArticlesById,
  getArticles,
  patchVotes,
} = require("./controllers/articlesControllers.js");

const getUsers = require("./controllers/usersController.js");

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

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.delete("/api/comments/:comment_id", deleteComment);

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
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
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
  if (err.code === "23503") {
    res.status(400).send({ message: "Bad Request - no user found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "Bad Request") {
    res.status(400).send({ message: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "no comment with this id") {
    res.status(404).send({ message: "no comment with this id" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "topic not available :(") {
    res.status(404).send({ message: "topic not available :(" });
  } else {
    next(err);
  }
});

module.exports = app;

//UNUSED BUT NOT DELETING IN CASE I NEED IT FOR SOMETHING, WILL DELETE IF UNUSED WHEN FINISHED
// app.use((err, req, res, next) => {
//   if (err.code === "ERR_HTTP_INVALID_STATUS_CODE") {
//     res.status(400).send({ message: "Bad Request" });
//   } else {
//     next(err);
//   }
// });
