import * as usersUC from "../../../../use-cases/users";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder, sanitizerPayload } from "../../../../commons/utils";
import { StatusCode, ResponseMessage } from "../../../../commons/constants";

async function create(req: any, res: any, next: any) {
  try {
    const payload = sanitizerPayload(req.body);
    const data = await usersUC.create(payload);
    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Added,
        data,
      })
    );
    next();
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default create;