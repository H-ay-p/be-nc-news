const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");

/* Set up your beforeEach & afterAll functions here */

afterAll(() => connection.end());

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
