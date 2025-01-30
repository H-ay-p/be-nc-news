const fetchUsers = require("../models/usersModel");

const getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};

module.exports = getUsers;
