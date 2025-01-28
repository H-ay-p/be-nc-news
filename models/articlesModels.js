const db = require("../db/connection.js");

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * from articles WHERE article_id=$1`, [id])
    .then((response) => {
      return response.rows[0];
    });
};

// const fetchSnackBySnackId = (id) => {
//     return db
//       .query(`SELECT * FROM snacks WHERE snack_id=$1`, [id]) // subsitution - $1 == first element in the array
//       .then(({ rows }) => {
//         if (rows.length === 0) {
//           // no results = thats an error
//           return Promise.reject({ message: "snack not found" });
//         } else {
//           // results = no error
//           return rows[0];
//         }
//       });
//   };

module.exports = fetchArticleById;
