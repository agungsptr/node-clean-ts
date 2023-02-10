import usersDA from "../../data-access/users";
import * as uuid from "uuid";

async function logout(payload: any) {
  const user = await usersDA.findUserCredential({ _id: payload.userId });
  if (user) {
    await usersDA.update(user.id, { secretUuid: uuid.v4() });
  }
}

export default logout;
