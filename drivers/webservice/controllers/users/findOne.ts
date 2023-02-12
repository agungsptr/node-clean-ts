import * as usersUC from "../../../../use-cases/users";
import { responseWithError } from "../../../../commons/errors";
import { responseBuilder } from "../../../../commons/utils";
import { StatusCode, ResponseMessage } from "../../../../commons/constants";
import { Request, Response, NextFunction } from "express";

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await usersUC.findOne(id);
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
