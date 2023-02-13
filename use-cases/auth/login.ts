import Joi from "joi";
import moment from "moment";
import { ErrorName } from "../../commons/constants";
import CustomError from "../../commons/customError";
import { Payload } from "../../commons/type";
import {
  comparePassword,
  getExpiredToken,
  issueJwt,
  validatorSchema,
} from "../../commons/utils";
import usersDA from "../../data-access/users";

async function login(payload: Payload) {
  const { username, password } = payload;

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = validatorSchema(schema)(payload);
  if (error.length > 0) throw new CustomError(ErrorName.Invalid, error);

  const user = await usersDA.findUserCredential({ username: String(username) });
  if (user) {
    if (await comparePassword(String(password), user.password!)) {
      const token = issueJwt(
        { id: user.id, username: user.password },
        user.secretUuid
      );
      return {
        loggedIn: moment().toISOString(),
        expired: getExpiredToken(token),
        token: `Bearer ${token}`,
      };
    }
  }
  return false;
}

export default login;
