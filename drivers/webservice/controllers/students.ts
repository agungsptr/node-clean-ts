import Controller from "./controller";
import * as studentsUC from "../../../use-cases/students";
import { Student } from "../../../models/student";

const students = Controller<Student>(studentsUC);

export default { ...students };
