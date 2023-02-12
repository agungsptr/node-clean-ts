import CustomError from "../../commons/customError";
import UserSchema from "./user.schema";
import { Types } from "mongoose";
import { validatorSchema } from "../../commons/utils";

type User = {
  id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  secretUuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

function builder(payload: any) {
  const { error, value } = validatorSchema(UserSchema)({
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
    password: payload.password,
    secretUuid: payload.secretUuid,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  });
  if (error.length > 0) throw new CustomError(error);
  return value;
}

export { User, builder };
