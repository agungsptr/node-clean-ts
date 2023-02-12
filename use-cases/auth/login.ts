import Joi from "joi";
import moment from "moment";
import CustomError from "../../commons/customError";
import {
  comparePassword,
  getExpiredToken,
  issueJwt,
  validatorSchema,
} from "../../commons/utils";
import usersDA from "../../data-access/users";

async function login(payload: any) {
  const { username, password } = payload;

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = validatorSchema(schema)(payload);
  if (error.length > 0) throw new CustomError(error);

  const user = await usersDA.findUserCredential({ username });
  if (user) {
    if (await comparePassword(password, user.password!)) {
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
