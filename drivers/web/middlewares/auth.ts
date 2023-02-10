import { ifEmptyThrowError } from "../../../commons/checks";
import { ResponseMessage, StatusCode } from "../../../commons/constants";
import {
  responseBuilder,
  tokenSplitter,
  verifyJwt,
} from "../../../commons/utils";
import jwt from "jsonwebtoken";
import usersDA from "../../../data-access/users";
import { responseWithError } from "../../../commons/errors";

function unAuthRes(res: any) {
  res.status(StatusCode.Unauthorized).send(
    responseBuilder({
      statusCode: StatusCode.Unauthorized,
      message: ResponseMessage.FailAuth,
    })
  );
}

async function auth(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization;
    ifEmptyThrowError(token, "Authorization token is required");

    const splitted = tokenSplitter(token);
    if (splitted === undefined) {
      unAuthRes(res);
      return;
    }

    const decodedToken: any = jwt.decode(splitted[1]);
    const user = await usersDA.findUserCredential({ _id: decodedToken.id });

    if (user) {
      return verifyJwt(splitted[1], user.secretUuid, (a, error) => {
        if (error) {
          unAuthRes(res);
          return;
        }
        req.user = {
          userId: `${user.id}`,
          username: user.username,
        };
        next();
      });
    }
    unAuthRes(res);
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default auth;
