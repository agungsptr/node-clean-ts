import moment from "moment";
import studentsDA from "../../data-access/students";

async function update(id: string, payload: any) {
  payload.updatedAt = moment().toDate();
  return studentsDA.update(id, payload);
}

export default update;
