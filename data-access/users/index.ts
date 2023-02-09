import { DataAccess } from "../dataAccess";
import UsersModel from "../../db/models/users.model";
import { builder } from "../../models/user";
import serializer from "./serializer";
import { Model, ModelBuilder, Serializer } from "../../commons/type";
import { ifFalseThrowError, isValidObjectId } from "../../commons/checks";
import { hashPassword, queriesBuilder } from "../../commons/utils";
import { QueryOP } from "../../commons/constants";
import CustomError from "../../commons/customError";
import { repackageError } from "../../commons/errors";

class UsersDA extends DataAccess {
  constructor(
    model: Model,
    modelName: string,
    builder: ModelBuilder,
    serializer: Serializer
  ) {
    super(model, modelName, builder, serializer);
  }

  async update(id: string, payload: any) {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      const data = await this.model.findById(id);
      if (data) {
        const serializedData = this.serializer(data);
        if (payload.password) {
          data.password = hashPassword(payload.password);
          delete payload.password;
        }
        const dataToUpdate = this.builder({
          password: data.password,
          ...serializedData,
          ...payload,
        });
        await this.model.findByIdAndUpdate(id, dataToUpdate);
        return this.serializer({ _id: id, ...dataToUpdate });
      }
      throw new CustomError(`Data with id: ${id} in Users is not found`);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findUserCredential(queries: Record<string, any>) {
    try {
      if ("_id" in queries) {
        ifFalseThrowError(isValidObjectId(queries._id), "id is not valid");
      }
      return this.model
        .findOne(queriesBuilder(QueryOP.EQ, queries))
        .then((user) => {
          if (user) {
            return {
              ...this.serializer(user),
              password: user.password,
              secretUuid: user.secretUuid,
            };
          } else {
            throw new CustomError("Users is not found");
          }
        });
    } catch (e) {
      throw repackageError(e);
    }
  }
}

const usersDA = new UsersDA(UsersModel, "Users", builder, serializer);

export default usersDA;
