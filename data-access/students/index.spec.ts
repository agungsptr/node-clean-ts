import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import usersDA from "../users";
import studentsDA from "./index";
import { Student } from "../../models/student";
import { User } from "../../models/user";
chai.use(chaiAsPromised);

chai.use(chaiAsPromised);
const expect = chai.expect;
let user: User, student: Student;

describe("data-access/students", () => {
  beforeEach(async () => {
    await usersDA.removeAll();
    await studentsDA.removeAll();
    user = await usersDA.create({
      firstName: "agung",
      lastName: "saputra",
      username: "agungsptr",
      password: "24434",
    });
    student = await studentsDA.create({
      name: "howie",
      age: 12,
      grade: 3,
      perfect: true,
      createdBy: {
        userId: `${Object(user).id}`,
        username: Object(user).username,
      },
    });
    await studentsDA.create({
      name: "bill",
      age: 13,
      grade: 3,
      perfect: false,
      createdBy: {
        userId: `${Object(user).id}`,
        username: Object(user).username,
      },
    });
  });

  afterEach(async () => {
    await studentsDA.removeAll();
  });

  it("drops database", async () => {
    await studentsDA.removeAll();
    const list = await studentsDA.findAll();
    expect(list.total).to.equal(0);
  });

  it("list students", async () => {
    const list = await studentsDA.findAll();
    expect(list.total).to.equal(2);
  });

  it("find student by id", async () => {
    const data = await studentsDA.findOne(Object(student).id);
    expect(Object(data).id).to.eql(Object(student).id);
  });

  it("insert student", async () => {
    const felix = {
      name: "felix",
      grade: 2,
      age: 6,
      createdBy: {
        userId: `${Object(user).id}`,
        username: Object(user).username,
      },
    };
    const data = await studentsDA.create(felix);
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    expect(data).to.eql({
      perfect: false,
      ...felix,
    });
  });

  it("throw error if insert student with invalid payload", async () => {
    const invalid = {
      name: "bill",
      grade: "INSERT POISON INTO THIS",
    };
    expect(studentsDA.create(invalid)).to.eventually.be.rejected;
  });

  it("update student", async () => {
    await studentsDA.update(Object(student).id, { name: "updated name" });
    const data = await studentsDA.findOne(Object(student).id);
    expect(Object(data).name).to.eql("updated name");
  });

  it("delete student", async () => {
    await studentsDA.remove(Object(student).id);
    const list = await studentsDA.findAll();
    expect(list.total).to.equal(1);
    expect(studentsDA.remove("42")).to.eventually.be.rejected;
  });
});
