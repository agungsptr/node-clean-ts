import { Payload } from "../../commons/type";
import studentsDA from "../../data-access/students";

async function create(payload: Payload) {
  return studentsDA.create(payload);
};

export default create;
