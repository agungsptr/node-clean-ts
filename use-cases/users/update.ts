import moment from "moment";
import { Payload } from "../../commons/type";
import usersDA from "../../data-access/users";

async function update(id: string, payload: Payload) {
  payload.updatedAt = moment().toDate();
  return usersDA.update(id, payload);
}

export default update;
