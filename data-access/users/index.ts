import DataAccess from "../dataAccess";
import UsersModel from "../../db/models/users.model";
import { builder } from "../../models/user";
import serializer from "./serializer";
import { Model, ModelBuilder, Serializer } from "../../commons/type";

class UsersDA extends DataAccess {
  constructor(
    model: Model,
    modelName: string,
    builder: ModelBuilder,
    serializer: Serializer
  ) {
    super(model, modelName, builder, serializer);
  }
}

const usersDA = new UsersDA(UsersModel, "Users", builder, serializer);

export default usersDA;
