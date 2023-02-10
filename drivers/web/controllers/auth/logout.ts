import * as authUC from "../../../../use-cases/auth";
import { ResponseMessage, StatusCode } from "../../../../commons/constants";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";

async function logout(req: any, res: any, next: any) {
  try {
    const logout = await authUC.logout(req.user);
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
