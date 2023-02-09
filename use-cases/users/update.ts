import moment from "moment";
import usersDA from "../../data-access/users";

async function update(id: string, payload: any) {
  payload.updatedAt = moment().toDate();
  return usersDA.update(id, payload);
}

export default update;
