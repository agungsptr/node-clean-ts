import { Request, Response } from "express";
import { ResponseMessage, StatusCode } from "../../../commons/constants";
import { responseWithError } from "../../../commons/errors";
import { responseBuilder } from "../../../commons/utils";
import * as authUC from "../../../use-cases/auth";

async function login(req: Request, res: Response) {
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

async function logout(req: Request, res: Response) {
  try {
    const logout = await authUC.logout(req.body.user);
    if (logout) {
      res.status(StatusCode.OK).send(
        responseBuilder({
          statusCode: StatusCode.OK,
          message: ResponseMessage.LoggedOut,
        })
      );
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

export default { login, logout };
