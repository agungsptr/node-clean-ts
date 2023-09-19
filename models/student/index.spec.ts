import { builder } from ".";
import chai from "chai";
const expect = chai.expect;

describe("models/student", () => {
  it("throw error if name not found", () => {
    expect(() => {
      builder({
        grade: 1,
        age: 21,
        perfect: true,
        createdBy: {
          userId: "63587db7dc752a40e09721d7",
          username: "user",
        },
      });
    }).to.throw("\"name\" is required");
  });

  it("throw error if grade wrong data type", () => {
    expect(() => {
      builder({
        name: "Fulan",
        grade: "One",
        age: 21,
        perfect: true,
        createdBy: {
          userId: "63587db7dc752a40e09721d7",
          username: "user",
        },
      });
    }).to.throw("\"grade\" must be a number");
  });

  it("throw error if age wrong data type", () => {
    expect(() => {
      builder({
        name: "Fulan",
        grade: 1,
        age: "TwentyOne",
        perfect: true,
        createdBy: {
          userId: "63587db7dc752a40e09721d7",
          username: "user",
        },
      });
    }).to.throw("\"age\" must be a number");
  });

  it("throw error if perfect wrong data type", () => {
    expect(() => {
      builder({
        name: "Fulan",
        grade: 1,
        age: 21,
        perfect: "trueFalse",
        createdBy: {
          userId: "63587db7dc752a40e09721d7",
          username: "user",
        },
      });
    }).to.throw("\"perfect\" must be a boolean");
  });

  it("sets perfect to false by default", () => {
    const student = builder({
      createdBy: {
        userId: "63587db7dc752a40e09721d7",
        username: "user-editor",
      },
      name: "howie",
    });
    expect(Object(student).perfect).to.equal(false);
  });
});
