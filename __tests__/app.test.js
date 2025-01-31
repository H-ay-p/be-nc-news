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
  test("400: Responds with Bad Request when given an invalid id", () => {
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
  test("404: Responds with a sad message when no article is present for that id", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("no article for this id :(");
      });
  });
  test("400: Responds with Bad Request when given an invalid id", () => {
    return request(app)
      .post("/api/articles/notAnId/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
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

describe("DELETE /api/comments/:comment_id", () => {
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

describe("GET /api/users", () => {
  test("responds with an array of objects, each object should have the following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        expect(users.length).toBe(4);
        expect(Array.isArray(users));
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });

  //NOTE - I KNOW THAT THIS TEST IS UNNECCESSARY AS BAD URLS ARE ALREADY COVERED. HOWEVER, THE QUESTION STATES TO CONSIDER
  //ERRORS AND TEST FOR THEM. I CAN'T THINK OF ANY OTHER POTENTIAL ERRORS SO PUTTING THIS HERE (unless I were to also write a
  //delete users, run it and then test for no users but I think the question would have said if we were supposed to write a
  //delete users as well? let me know if I'm supposed to be adding that?)

  test("GET:404 if path is invalid/mispelt", () => {
    return request(app)
      .get("/api/notUsers")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Not found!");
      });
  });
});

describe("GET /api/articles WITH SORT AND ORDER", () => {
  test(`200 responds with array of articles as previously, sorted by column title with default descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article).toHaveProperty("comment_count");
        });
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test(`200 works sorting by author with default descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test(`200 works sorting by article_id with default descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });
  test(`200 works sorting by topic with default descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test(`200 works sorting by votes with default descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test(`200 works sorting by comment_count with default descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(Number(articles[0].comment_count)).toBeGreaterThan(
          Number(articles[4].comment_count)
        );
        //unsure how to do the number conversion in jest sorted or elsewhere
      });
  });
  test(`200 works sorting with specified ascending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test(`200 works sorting with specified descending order`, () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test.only(`200 works sorting with specified order when no sort`, () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(response.body));
        expect(articles.length).toBe(13);
        expect(articles).toBeSorted({
          descending: true,
        });
      });
  });
  test(`400 returns bad request when sort parameter is inavlid`, () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column_name&order=desc")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test(`400 returns bad request when order parameter is inavlid`, () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles WITH TOPIC QUERY", () => {
  test(`200 filters the articles by the topic value specified in the query.`, () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(articles));
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test(`200 still returns all articles if no topic specified`, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(articles));
        expect(articles.length).toBe(13);
      });
  });
  test(`200 returns empty array if no articles for this topic`, () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(Array.isArray(articles));
        expect(articles.length).toBe(0);
        expect(articles).toEqual([]);
      });
  });
  //CONSIDERED TESTING FOR "INVALID TOPIC" BUT ANYTHING COULD BE THE TOPIC OF AN ARTICLE,
  //EVEN A NUMBER OR A TYPE OF PUNCTUATION. SO LEFT IT AT THIS. WILL EDIT IF NEEDED.
  test(`404 sad message if topic does not exist`, () => {
    return request(app)
      .get("/api/articles?topic=mushrooms")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("topic not available :(");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: as above with addition of comment_count property", () => {
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
        expect(response.body).toHaveProperty("comment_count");
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
