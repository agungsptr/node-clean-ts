import usersDA from "../../data-access/users";
import * as uuid from "uuid";
import { Payload } from "../../commons/type";

async function logout(payload: Payload): Promise<boolean> {
  const user = await usersDA.findUserCredential({
    _id: String(payload.userId),
  });
  if (user) {
    await usersDA.update(user.id!.toString(), { secretUuid: uuid.v4() });
    return true;
  }
  return false;
}

export default logout;
