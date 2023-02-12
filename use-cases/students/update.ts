import moment from "moment";
import { Payload } from "../../commons/type";
import studentsDA from "../../data-access/students";

async function update(id: string, payload: Payload) {
  payload.updatedAt = moment().toDate();
  return studentsDA.update(id, payload);
}

export default update;
