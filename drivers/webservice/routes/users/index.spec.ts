import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import { Express } from "express";
import usersDA from "../../../../data-access/users";
import * as setup from "../../../../test/setup";
import { User } from "../../../../models/user";

chai.use(chaiAsPromised);
const expect = chai.expect;

let app: Express, user: User, auth: any;
const API_URL = "/api/user";

describe("routes/users", () => {
  before(async () => {
    app = await setup.beforeAction();
  });

  beforeEach(async () => {
    await usersDA.removeAll();
    user = await usersDA.create({
      firstName: "agung",
      lastName: "saputra",
      username: "agungsptr",
      password: "24434",
    });

    auth = await request(app)
      .post("/api/auth/login")
      .send({
        username: Object(user).username,
        password: "24434",
      })
      .then((res) => res.body.data);
  });

  afterEach(async () => {
    await usersDA.removeAll();
  });

  it(`GET ${API_URL}s`, async () => {
    const req = await request(app)
      .get(`${API_URL}s`)
      .set("Authorization", auth.token)
      .send();

    expect(req.statusCode).to.eql(200);
    expect(req.body.data.length).to.eql(1);
  });

  it(`GET ${API_URL}/:id`, async () => {
    const list = await usersDA.findAll();
    const data = Object(list.data[0]);
    const req = await request(app)
      .get(`${API_URL}/${data.id}`)
      .set("Authorization", auth.token)
      .send();
    const expectVal = {
      ...req.body.data,
      createdAt: new Date(req.body.data.createdAt),
      updatedAt: new Date(req.body.data.updatedAt),
    };

    expect(req.statusCode).to.eql(200);
    expect(expectVal).to.eql({
      ...data,
      id: data.id.valueOf(),
    });
  });

  it(`POST ${API_URL}`, async () => {
    const data = {
      firstName: "agung2",
      lastName: "saputra2",
      username: "agungsptr2",
      password: "24434",
    };
    const req = await request(app)
      .post(`${API_URL}`)
      .set("Authorization", auth.token)
      .send(data);
    const result = req.body.data;

    expect(req.statusCode).to.eql(200);
    expect(result.firstName).to.eql(data.firstName);
    expect(result.lastName).to.eql(data.lastName);
    expect(result.username).to.eql(data.username);
  });

  it(`PATCH ${API_URL}/:id`, async () => {
    const list = await usersDA.findAll();
    const data = Object(list.data[0]);
    const dataToUpdate = {
      firstName: "agung2-edit",
      lastName: "saputra2-edit",
    };
    const req = await request(app)
      .patch(`${API_URL}/${data.id}`)
      .set("Authorization", auth.token)
      .send(dataToUpdate);
    const result = req.body.data;

    expect(req.statusCode).to.eql(200);
    expect(result.firstName).to.eql(dataToUpdate.firstName);
  });

  it(`DELETE ${API_URL}/:id`, async () => {
    const list = await usersDA.findAll();
    const data = Object(list.data[0]);
    const req = await request(app)
      .delete(`${API_URL}/${data.id}`)
      .set("Authorization", auth.token)
      .send();
    const updatedList = await usersDA.findAll();

    expect(req.statusCode).to.eql(200);
    expect(updatedList.total).to.eql(0);
  });
});
