import serializer from "./serializer";
import StudentsModel, { modelName } from "../../db/models/students.model";
import { DataAccess } from "../dataAccess";
import { builder, Student } from "../../models/student";

class StudentsDA extends DataAccess<Student> {}

const studentsDA = new StudentsDA(
  { model: StudentsModel, name: modelName },
  builder,
  serializer
);

export default studentsDA;
