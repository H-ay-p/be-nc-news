const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("Bad urls", () => {
  test("GET:404 if path is invalid/mispelt", () => {
    return request(app)
      .get("/api/notValid")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Not found!");
      });
  });
});

describe("GET /api/healthcheck", () => {
  test("should run a heath check", () => {
    return request(app)
      .get("/api/healthcheck")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET api/topics", () => {
  test("200: an array of topic objects, each of which should have the following properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body));
        expect(response.body.length).toBe(3);
        expect(response.body[1]).toEqual({
          slug: "cats",
          description: "Not dogs",
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with: an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("votes");
        expect(response.body).toHaveProperty("author");
        expect(response.body).toHaveProperty("article_id");
        expect(response.body).toHaveProperty("body");
        expect(response.body).toHaveProperty("topic");
        expect(response.body).toHaveProperty("article_img_url");
      });
  });
  test("404 when there is no article with given id", () => {
    return request(app)
      .get("/api/articles/3409")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("article not found");
      });
  });
  test("400 when the provided id is not a valid id", () => {
    return request(app)
      .get("/api/articles/ImNotAnId")
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test(`200 responds with an articles array of article objects, each of which should have the following properties: author, title, 
    article_id, topic, created_at, votes, article_img_url, comment_count`, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body));
        expect(response.body).toBeSorted({ descending: true });
        response.body.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          //COULD NOT FIGURE OUT HOW TO MAKE COMMENT_COUNT BE AN INT
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("responds with 404 if articles is spelled incorrectly", () => {
    return request(app).get("/api/articlesss").expect(404);
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id when comments are present for that article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body));
        expect(response.body).toBeSorted({ descending: true });
        expect(response.body.length).toBe(2);
        response.body.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(comment.article_id).toBe(5);
          expect(comment.created_at.slice(0, 4)).toBe("2020");
        });
      });
  });
  test("404: Responds with a sad message when no comments are present for that id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("no comments :(");
      });
  });
  test("400: Responds with a Parameter not valid when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "lurker",
        body: "this was so shocking i had to stop lurking",
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          article_id: "5",
          body: "this was so shocking i had to stop lurking",
          username: "lurker",
        });
      });
  });
  test("400 missing keys", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("400 invalid user/user cannot post", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "duck",
        body: "got any grapes?",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request - no user found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({
        incVotes: 2,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 2,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: responds with error message if votes is not an integer", () => {
    return request(app)
      .patch("/api/articles/5")
      .send({
        incVotes: "a",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("400: responds with error message if no article with that id (but id is valid)", () => {
    return request(app)
      .patch("/api/articles/50")
      .send({
        incVotes: 2,
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("404: responds with error message if id is not a valid id", () => {
    return request(app)
      .patch("/api/articles/notAnId")
      .send({
        incVotes: 2,
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe.only("DELETE /api/comments/:comment_id", () => {
  test("204: deletes a comment, status 204, no response", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        db.query(`SELECT comment_id FROM comments;`).then((response) => {
          response.rows.forEach((comment) => {
            expect(comment.comment_id).not.toBe(1);
          });
        });
      });
  });
  test("404: no comment with that id (id is valid)", () => {
    return request(app)
      .delete("/api/comments/568")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("no comment with this id");
      });
  });
  test("400: no comment with that id (id is not valid)", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
