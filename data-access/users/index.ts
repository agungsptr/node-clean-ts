import mongoose from "mongoose";
import serializer from "./serializer";
import UsersModel, { modelName, unique } from "../../db/models/users.model";
import CustomError from "../../commons/customError";
import { DataAccess } from "../dataAccess";
import { ErrorName, QueryOP } from "../../commons/constants";
import { builder, User } from "../../models/user";
import { repackageError } from "../../commons/errors";
import { hashPassword, queriesBuilder } from "../../commons/utils";
import { isValidObjectId } from "../../commons/checks";
import { Payload } from "../../commons/type";

class UsersDA extends DataAccess<User> {
  constructor(
    model: {
      model: mongoose.Model<any>;
      name: string;
      unique?: Array<string>;
    },
    builder: (payload: Payload) => User | undefined,
    serializer: (payload: Payload) => User
  ) {
    super(model, builder, serializer);
  }

  async update(id: string, payload: Payload): Promise<User> {
    try {
      if (!isValidObjectId(id)) {
        throw new CustomError(ErrorName.Invalid, "id is not valid");
      }
      const data = await this.model.model.findById(id);
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
        await this.model.model.findByIdAndUpdate(id, dataToUpdate);
        return this.serializer({ ...dataToUpdate, _id: id });
      }
      throw new CustomError(
        ErrorName.NotFound,
        `Data with id: ${id} in Users is not found`
      );
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findUserCredential(
    queries: Record<string, string | number | boolean>
  ): Promise<User> {
    try {
      if ("_id" in queries) {
        if (!isValidObjectId(String(queries._id))) {
          throw new CustomError(ErrorName.Invalid, "id is not valid");
        }
      }
      return this.model.model
        .findOne(queriesBuilder(QueryOP.EQ, queries))
        .then((data) => {
          if (data) return data;
          throw new CustomError(ErrorName.NotFound, "Users is not found");
        });
    } catch (e) {
      throw repackageError(e);
    }
  }
}

const usersDA = new UsersDA(
  {
    model: UsersModel,
    name: modelName,
    unique,
  },
  builder,
  serializer
);

export default usersDA;
