import { ResponseMessage, StatusCode } from "../../../../commons/constants";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import * as studentsUC from "../../../../use-cases/students";

async function remove(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    await studentsUC.remove(id);

    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Removed,
      })
    );
    return next();
  } catch (e) {
    return responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default remove;
