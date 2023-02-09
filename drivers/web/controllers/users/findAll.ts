import { ResponseMessage, StatusCode } from "../../../../commons/constants";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import * as usersUC from "../../../../use-cases/users";

async function findAll(req: any, res: any, next: any) {
  try {
    const { limit, page, ...q } = req.query;
    const result = await usersUC.findAll(q, limit, page);
    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Loaded,
        ...result,
      })
    );
    return next();
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default findAll;
