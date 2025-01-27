const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");

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
