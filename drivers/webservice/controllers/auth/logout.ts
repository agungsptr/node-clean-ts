import * as authUC from "../../../../use-cases/auth";
import { ResponseMessage, StatusCode } from "../../../../commons/constants";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import { Request, Response, NextFunction } from "express";

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const logout = await authUC.logout(req.body.user);
    if (logout) {
      res.status(StatusCode.OK).send(
        responseBuilder({
          statusCode: StatusCode.OK,
          message: ResponseMessage.LoggedOut,
        })
      );
      next();
      return;
    }
    res.status(StatusCode.BadRequest).send(
      responseBuilder({
        statusCode: StatusCode.BadRequest,
        message: "Failed logout",
      })
    );
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default logout;
