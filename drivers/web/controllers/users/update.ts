import { ResponseMessage, StatusCode } from "../../../../commons/constants";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder, sanitizerPayload } from "../../../../commons/utils";
import * as usersUC from "../../../../use-cases/users";

async function update(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const payload = sanitizerPayload(req.body);
    const data = await usersUC.update(id, payload);
    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Updated,
        data,
      })
    );
    return next();
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default update;
