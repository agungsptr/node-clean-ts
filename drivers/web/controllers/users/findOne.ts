import usersDA from "../../../../data-access/users";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import { StatusCode, ResponseMessage } from "../../../../commons/constants";

async function findOne(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const data = await usersDA.findOne(id);
    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Loaded,
        data,
      })
    );
    next();
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default findOne;
