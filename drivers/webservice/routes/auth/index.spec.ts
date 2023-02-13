import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import { Express } from "express";
import * as usersUC from "../../../../use-cases/users";
import usersDA from "../../../../data-access/users";
import * as setup from "../../../../test/setup";
import { User } from "../../../../models/user";

chai.use(chaiAsPromised);
const expect = chai.expect;

let app: Express, user: User, auth: any;
const API_URL = "/api/auth";

describe("routes/auth", () => {
  before(async () => {
    app = await setup.beforeAction();
  });

  beforeEach(async () => {
    await usersDA.removeAll();
    user = await usersUC.create({
      firstName: "agung",
      lastName: "saputra",
      username: "agungsptr",
      password: "24434",
    });

    auth = await request(app)
      .post(`${API_URL}/login`)
      .send({
        username: Object(user).username,
        password: "24434",
      })
      .then((res) => res.body.data);
  });

  afterEach(async () => {
    await usersDA.removeAll();
  });

  it(`LOGIN ${API_URL}/login`, async () => {
    const req = await request(app)
      .post(`${API_URL}/login`)
      .send({ username: Object(user).username, password: "24434" });

    expect(req.statusCode).to.eql(200);
  });

  it("LOGIN with wrong password", async () => {
    const req = await request(app)
      .post(`${API_URL}/login`)
      .send({ username: Object(user).username, password: "wrong" });

    expect(req.statusCode).to.eql(401);
  });

  it("LOGIN without username or password", async () => {
    const req = await request(app)
      .post(`${API_URL}/login`)
      .send({ username: Object(user).username });

    expect(req.statusCode).to.eql(401);
  });

  it(`LOGOUT ${API_URL}/logout`, async () => {
    const req = await request(app)
      .post(`${API_URL}/logout`)
      .set("Authorization", auth.token)
      .send();
    expect(req.statusCode).to.eql(200);

    const tryGetUsers = await request(app)
      .get("/api/users")
      .set("Authorization", auth.token)
      .send();
    expect(tryGetUsers.statusCode).to.eql(401);
  });

  it("LOGOUT with deleted user", async () => {
    await usersDA.removeAll();
    const req = await request(app)
      .post(`${API_URL}/logout`)
      .set("Authorization", auth.token)
      .send();
    expect(req.statusCode).to.eql(401);
  });

  it("LOGOUT without token", async () => {
    const req = await request(app).post(`${API_URL}/logout`).send();
    expect(req.statusCode).to.eql(401);
  });

  it("LOGOUT with invalid userId in token", async () => {
    const req = await request(app)
      .post(`${API_URL}/logout`)
      .set(
        "Authorization",
        // eslint-disable-next-line max-len
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMSIsInVzZXJuYW1lIjoiYWd1bmdzcHRyIiwiaWF0IjoxNjY3NzI3Njk4LCJleHAiOjE2Njc4MTQwOTh9.gal5Y7l074x-TuxBP2lGt7_QVAbzX3h2I18WPZnYKBw"
      )
      .send();
    expect(req.statusCode).to.eql(401);
  });

  it("LOGOUT with wrong token format", async () => {
    await usersDA.removeAll();
    const req = await request(app)
      .post(`${API_URL}/logout`)
      .set("Authorization", `new token ${auth.token}`)
      .send();
    expect(req.statusCode).to.eql(401);
  });
});
