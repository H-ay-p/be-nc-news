const fetchTopics = require("../models/topicsModel.js");

const getTopics = (req, res) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      console.log("in the error catch");
      next(err);
    });
};

module.exports = getTopics;
