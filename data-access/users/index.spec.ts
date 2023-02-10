import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Data } from "../../commons/type";
import usersDA from "./index";
chai.use(chaiAsPromised);

const expect = chai.expect;
let user: Data;

describe("data-access/users", () => {
  beforeEach(async () => {
    await usersDA.removeAll();
    user = await usersDA.create({
      firstName: "abd",
      lastName: "rahman",
      username: "abdr",
      password: "24434",
    });
  });

  afterEach(async () => {
    await usersDA.removeAll();
  });

  it("drops database", async () => {
    await usersDA.removeAll();
    const result = await usersDA.findAll();
    expect(result.total).to.equal(0);
  });

  it("lists users", async () => {
    const result = await usersDA.findAll();
    expect(result.total).to.equal(1);
  });

  it("find single user by id", async () => {
    const result = await usersDA.findOne(Object(user).id);
    expect(Object(result).id).to.eql(Object(user).id);
  });

  it("insert a user", async () => {
    const userData = {
      firstName: "first",
      lastName: "last",
      username: "usrnm",
    };
    const newUser = await usersDA.create({ ...userData, password: "24434" });
    expect({
      firstName: Object(newUser).firstName,
      lastName: Object(newUser).lastName,
      username: Object(newUser).username,
    }).to.eql(userData);
  });

  it("update user", async () => {
    await usersDA.update(Object(user).id, { firstName: "edited-fistname" });
    const result = await usersDA.findOne(Object(user).id);
    expect(Object(result).firstName).to.eql("edited-fistname");
  });

  it("delete a user", async () => {
    await usersDA.remove(Object(user).id);
    const users = await usersDA.findAll();
    expect(users.total).to.equal(0);
    expect(usersDA.remove(Object(user).id)).to.eventually.be.rejected;
  });
});
