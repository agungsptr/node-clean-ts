import config from "../config";
import { StatusCode, ErrorMessage } from "./constants";
import CustomError from "./customError";
import { responseBuilder } from "./utils";
import * as logger from "./logger";
import { Response } from "express";

const appName = `${config.NODE_ENV}`.toLowerCase();

function logError(err: Error): void {
  if (appName.includes("test") || appName.includes("development")) {
    console.log(err);
  } else {
    const log = logger.createLogger();
    log.error(err);
  }
}

function repackageError(err: unknown) {
  if (err instanceof CustomError) {
    return err;
  } else {
    const error = new Error();
    if (
      err !== null &&
      err !== undefined &&
      typeof err === "object" &&
      "stack" in err
    ) {
      error.stack += `\nCaused by:\n${err.stack}`;
    }
    if (config.isDevelopment) console.log(error);
    return error;
  }
}

function responseWithError(
  res: Response,
  err: unknown,
  customErrorCode: StatusCode = StatusCode.BadRequest
) {
  if (err instanceof CustomError) {
    return res.status(customErrorCode).send(
      responseBuilder({
        statusCode: customErrorCode,
        message: err.listMessage ?? err.message,
      })
    );
  } else {
    if (err instanceof Error) {
      logError(err);
    }
    return res.status(500).send(ErrorMessage.SomethingWentWrong);
  }
}

export { repackageError, responseWithError, logError };
