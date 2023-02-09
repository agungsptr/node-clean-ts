import DataAccess from "../dataAccess";
import StudentsModel from "../../db/models/students.model";
import { builder } from "../../models/student";
import serializer from "./serializer";
import { Model, ModelBuilder, Serializer } from "../../commons/type";

class StudentsDA extends DataAccess {
  constructor(
    model: Model,
    modelName: string,
    builder: ModelBuilder,
    serializer: Serializer
  ) {
    super(model, modelName, builder, serializer);
  }
}

const studentsDA = new StudentsDA(StudentsModel, "Students", builder, serializer);

export default studentsDA;
