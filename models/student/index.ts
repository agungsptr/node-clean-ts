import CustomError from "../../commons/customError";
import StudentSchema from "./student.schema";
import { Types } from "mongoose";
import { validatorSchema } from "../../commons/utils";

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
  createdAt: Date;
  updatedAt: Date;
};

function builder(payload: any) {
  const { error, value } = validatorSchema(StudentSchema)(payload);
  if (error.length > 0) throw new CustomError(error);
  return value;
}

export { Student, builder };
