import mongoose from "mongoose";
import serializer from "./serializer";
import StudentsModel, { modelName } from "../../db/models/students.model";
import { DataAccess } from "../dataAccess";
import { builder, Student } from "../../models/student";
import { Payload } from "../../commons/type";

class StudentsDA extends DataAccess<Student> {
  constructor(
    model: {
      model: mongoose.Model<any>;
      name: string;
    },
    builder: (payload: Payload) => Student | undefined,
    serializer: (payload: Payload) => Student
  ) {
    super(model, builder, serializer);
  }
}

const studentsDA = new StudentsDA(
  { model: StudentsModel, name: modelName },
  builder,
  serializer
);

export default studentsDA;
