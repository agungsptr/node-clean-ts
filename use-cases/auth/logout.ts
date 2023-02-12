import usersDA from "../../data-access/users";
import * as uuid from "uuid";

async function logout(payload: any): Promise<boolean> {
  const user = await usersDA.findUserCredential({ _id: payload.userId });
  if (user) {
    await usersDA.update(user.id!.toString(), { secretUuid: uuid.v4() });
    return true;
  }
  return false;
}

export default logout;
