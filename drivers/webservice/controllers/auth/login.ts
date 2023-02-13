import * as authUC from "../../../../use-cases/auth";
import { ResponseMessage, StatusCode } from "../../../../commons/constants";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import { Request, Response, NextFunction } from "express";

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const login = await authUC.login(req.body);
    if (login) {
      res.status(StatusCode.OK).send(
        responseBuilder({
          statusCode: StatusCode.OK,
          message: ResponseMessage.AuthSuccess,
          data: login,
        })
      );
      next();
      return;
    }
    res.status(StatusCode.Unauthorized).send(
      responseBuilder({
        statusCode: StatusCode.Unauthorized,
        message: ResponseMessage.FailAuth,
      })
    );
  } catch (e) {
    responseWithError(res, e, StatusCode.Unauthorized);
  }
}

export default login;
