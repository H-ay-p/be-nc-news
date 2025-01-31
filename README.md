# Northcoders News API

Link: https://nc-news-3wsj.onrender.com/api/

Developed using node.js v22.9.0 and PostgreSQL 14.15 on Ubuntu.

This is an nc_news api where one can view articles, view comments and post comments.

To clone, please fork the repo and then type "git clone " followed by the http link in your terminal. Then you can push any changes to your own version of the repo.

You will need .env files - Create two .env files (.env.test and .env.development). In each one, insert "PGDATABASE=" followed by the relevant database name (found in setup.sql).

Details of dependencies can be found in the package.json. After installing them, run npm setup-db to start the database and npm seed to seed it. Then run "npm test" to run the test files.

Summary of endpoints:

(for further detail please see the endpoints.json)

GET /api endpoint - shows the endpoints, each with a short description.

GET /api/topics endpoint - returns an array of topics

GET /api/articles/:article_id - returns an article object with the specified id

GET /api/articles - returns an array of all articles

GET /api/articles/:article_id/comments - returns comments for given article

POST /api/articles/:article_id/comments - posts a new comment

PATCH /api/articles/:article_id - updates the number of votes for an article

DELETE /api/comments/:comment_id - deletes a comment with specified id (if comment exists)

GET /api/users - returns an array of users

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
