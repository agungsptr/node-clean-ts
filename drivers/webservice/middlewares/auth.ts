import {
  ErrorName,
  ResponseMessage,
  StatusCode,
} from "../../../commons/constants";
import {
  responseBuilder,
  tokenSplitter,
  verifyJwt,
} from "../../../commons/utils";
import jwt from "jsonwebtoken";
import usersDA from "../../../data-access/users";
import { responseWithError } from "../../../commons/errors";
import { Request, Response, NextFunction } from "express";
import CustomError from "../../../commons/customError";

function unAuthRes(res: Response) {
  res.status(StatusCode.Unauthorized).send(
    responseBuilder({
      statusCode: StatusCode.Unauthorized,
      message: ResponseMessage.FailAuth,
    })
  );
}

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    if (token === undefined) {
      throw new CustomError(
        ErrorName.Invalid,
        "Authorization token is required"
      );
    }

    const splitted = tokenSplitter(token);
    if (splitted === undefined) {
      unAuthRes(res);
      return;
    }

    const decodedToken = jwt.decode(splitted[1]);
    if (typeof decodedToken === "string" || decodedToken === null) {
      unAuthRes(res);
      return;
    }
    const user = await usersDA.findUserCredential({ _id: decodedToken.id });

    if (user) {
      if (user.secretUuid === undefined) {
        unAuthRes(res);
        return;
      }
      return verifyJwt(splitted[1], user.secretUuid, (a, error) => {
        if (error) {
          unAuthRes(res);
          return;
        }
        req.body.user = {
          userId: `${user.id}`,
          username: user.username,
        };
        next();
      });
    }
    unAuthRes(res);
  } catch (e) {
    responseWithError(res, e, StatusCode.Unauthorized);
  }
}

export default auth;
