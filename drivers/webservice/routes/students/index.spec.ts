import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import { Express } from "express";
import usersDA from "../../../../data-access/users";
import studentsDA from "../../../../data-access/students";
import * as studentsUC from "../../../../use-cases/students";
import * as setup from "../../../../test/setup";
import { Data } from "../../../../commons/type";

chai.use(chaiAsPromised);
const expect = chai.expect;

let app: Express, user: Data, auth: any;
const API_URL = "/api/student";

describe("routes/students", () => {
  before(async () => {
    app = await setup.beforeAction();
  });

  beforeEach(async () => {
    await usersDA.removeAll();
    await studentsDA.removeAll();
    user = await usersDA.create({
      firstName: "agung",
      lastName: "saputra",
      username: "agungsptr",
      password: "24434",
    });
    await studentsUC.create({
      name: "howie",
      age: 12,
      grade: 3,
      perfect: true,
      createdBy: {
        userId: `${Object(user).id}`,
        username: Object(user).username,
      },
    });
    await studentsUC.create({
      name: "bill",
      age: 13,
      grade: 3,
      perfect: false,
      createdBy: {
        userId: `${Object(user).id}`,
        username: Object(user).username,
      },
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
    await studentsDA.removeAll();
  });

  it(`GET ${API_URL}s`, async () => {
    const req = await request(app)
      .get(`${API_URL}s`)
      .set("Authorization", auth.token)
      .send();

    expect(req.statusCode).to.eql(200);
    expect(req.body.page.total).to.eql(2);
  });

  it(`GET ${API_URL}/:id`, async () => {
    const list = await studentsUC.findAll();
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
      grade: 1,
      name: "agungsptr",
      age: 17,
      perfect: true,
    };
    const req = await request(app)
      .post(`${API_URL}`)
      .set("Authorization", auth.token)
      .send(data);
    const result = req.body.data;
    console.log(req.body);

    expect(req.statusCode).to.eql(200);
    expect(result.grade).to.eql(data.grade);
    expect(result.name).to.eql(data.name);
  });

  it(`PATCH ${API_URL}/:id`, async () => {
    const list = await studentsUC.findAll();
    const data = Object(list.data[0]);
    const dataToUpdate = {
      grade: 2,
      name: "agungsptr-edit",
      age: 18,
      perfect: false,
    };
    const req = await request(app)
      .patch(`${API_URL}/${data.id}`)
      .set("Authorization", auth.token)
      .send(dataToUpdate);
    const result = req.body.data;

    expect(req.statusCode).to.eql(200);
    expect(result.name).to.eql(dataToUpdate.name);
  });

  it(`DELETE ${API_URL}/:id`, async () => {
    const list = await studentsUC.findAll();
    const data = Object(list.data[0]);
    const req = await request(app)
      .delete(`${API_URL}/${data.id}`)
      .set("Authorization", auth.token)
      .send();
    const updatedList = await studentsUC.findAll();

    expect(req.statusCode).to.eql(200);
    expect(updatedList.page.total).to.eql(1);
  });
});
