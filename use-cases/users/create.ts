import { Payload } from "../../commons/type";
import usersDA from "../../data-access/users";

async function create(payload: Payload) {
  return usersDA.create(payload);
};

export default create;
