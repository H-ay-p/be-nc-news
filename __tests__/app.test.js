const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
// const runseed = require("../db/seeds/run-seed.js");

/* Set up your beforeEach & afterAll functions here */

afterAll(() => connection.end());

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
        expect(response.body).toHaveProperty("created_at");
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
  test.only("400 when the thing provided is not an id", () => {
    return request(app)
      .get("/api/articles/ImNotAnId")
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Parameter not valid");
      });
  });
});
