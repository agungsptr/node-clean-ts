import mongoose from "../connection";
import { hashPassword } from "../../commons/utils";
import * as uuid from "uuid";

const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  firstName: String,
  lastName: String,
  username: { type: String, index: true, unique: true },
  password: String,
  secretUuid: { type: String, default: uuid.v4() },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UsersSchema.pre("save", async function () {
  if (this.password !== undefined) {
    this.password = hashPassword(this.password);
  }
});

const UsersModel = mongoose.model("Users", UsersSchema);

export default UsersModel;
