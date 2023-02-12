import mongoose from "mongoose";
import serializer from "./serializer";
import UsersModel from "../../db/models/users.model";
import CustomError from "../../commons/customError";
import { DataAccess } from "../dataAccess";
import { QueryOP } from "../../commons/constants";
import { builder, User } from "../../models/user";
import { repackageError } from "../../commons/errors";
import { hashPassword, queriesBuilder } from "../../commons/utils";
import { ifFalseThrowError, isValidObjectId } from "../../commons/checks";
import { Payload } from "../../commons/type";

class UsersDA extends DataAccess<User> {
  constructor(
    model: mongoose.Model<any>,
    modelName: string,
    builder: (payload: Payload) => User | undefined,
    serializer: (payload: Payload) => User
  ) {
    super(model, modelName, builder, serializer);
  }

  async update(id: string, payload: Payload): Promise<User> {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      const data = await this.model.findById(id);
      if (data) {
        const serializedData = this.serializer(data);
        if (payload.password) {
          data.password = hashPassword(String(payload.password));
          delete payload.password;
        }
        const dataToUpdate = this.builder({
          password: data.password,
          ...serializedData,
          ...payload,
          id,
        });
        await this.model.findByIdAndUpdate(id, dataToUpdate);
        return this.serializer({ ...dataToUpdate, id });
      }
      throw new CustomError(`Data with id: ${id} in Users is not found`);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findUserCredential(
    queries: Record<string, string | number | boolean>
  ): Promise<User> {
    try {
      if ("_id" in queries) {
        ifFalseThrowError(
          isValidObjectId(String(queries._id)),
          "id is not valid"
        );
      }
      return this.model
        .findOne(queriesBuilder(QueryOP.EQ, queries))
        .then((data) => {
          if (data) return data;
          throw new CustomError("Users is not found");
        });
    } catch (e) {
      throw repackageError(e);
    }
  }
}

const usersDA = new UsersDA(UsersModel, "Users", builder, serializer);

export default usersDA;
