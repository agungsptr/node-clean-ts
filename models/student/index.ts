import CustomError from "../../commons/customError";
import StudentSchema from "./student.schema";
import { Types } from "mongoose";
import { validatorSchema } from "../../commons/utils";
import { Payload } from "../../commons/type";
import { ErrorName } from "../../commons/constants";

type Student = {
  id?: Types.ObjectId;
  name: string;
  age: number;
  grade: number;
  perfect: boolean;
  createdBy: {
    userId: string;
    username: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

function builder(payload: Payload) {
  const { error, value } = validatorSchema<Student>(StudentSchema)({
    name: payload.name,
    age: payload.age,
    grade: payload.grade,
    perfect: payload.perfect,
    createdBy: payload.createdBy,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  });
  if (error.length > 0) throw new CustomError(ErrorName.Invalid, error);
  return value;
}

export { Student, builder };
