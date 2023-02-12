import Joi from "joi";
import mongoose from "mongoose";
import serializer from "./serializer";
import StudentsModel from "../../db/models/students.model";
import { DataAccess } from "../dataAccess";
import { builder, Student } from "../../models/student";

class StudentsDA extends DataAccess<Student> {
  constructor(
    model: mongoose.Model<any>,
    modelName: string,
    builder: (payload: any) => Joi.AnySchema<any> | undefined,
    serializer: (payload: any) => Student
  ) {
    super(model, modelName, builder, serializer);
  }
}

const studentsDA = new StudentsDA(
  StudentsModel,
  "Students",
  builder,
  serializer
);

export default studentsDA;
