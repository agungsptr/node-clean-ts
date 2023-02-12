import * as studentsUC from "../../../../use-cases/students";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import { StatusCode, ResponseMessage } from "../../../../commons/constants";
import { Request, Response, NextFunction } from "express";

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, page, ...q } = req.query;
    const result = await studentsUC.findAll(q, Number(limit), Number(page));
    res.status(StatusCode.OK).send(
      responseBuilder({
        statusCode: StatusCode.OK,
        message: ResponseMessage.Loaded,
        ...result,
      })
    );
    next();
  } catch (e) {
    responseWithError(res, e, StatusCode.BadRequest);
  }
}

export default findAll;
