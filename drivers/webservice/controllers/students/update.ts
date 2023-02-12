import * as studentsUC from "../../../../use-cases/students";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder, sanitizerPayload } from "../../../../commons/utils";
import { StatusCode, ResponseMessage } from "../../../../commons/constants";
import { Request, Response, NextFunction } from "express";

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const payload = sanitizerPayload(req.body);
    const data = await studentsUC.update(id, payload);
    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Updated,
        data,
      })
    );
    next();
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default update;
