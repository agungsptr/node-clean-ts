import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { QueryOP, Status, StatusCode } from "./constants";
import { Page, Response } from "./type";
import Joi from "joi";
import moment from "moment";

function responseBuilder({
  statusCode,
  message,
  data,
  page,
}: {
  statusCode: StatusCode;
  message: string | Array<string>;
  data?: Object | Array<Object> | null;
  page?: Page;
}) {
  const status = statusCode === StatusCode.OK ? Status.Success : Status.Failed;
  const result: Response = {
    statusCode,
    status,
    message,
  };
  if (data) result.data = data;
  if (page) result.page = page;
  return result;
}

function queriesBuilder(eqlType: QueryOP, queries?: Object): Object {
  const obj: Record<string, any> = {};
  if (queries === undefined) return obj;
  for (const [key, val] of Object.entries(queries)) {
    if (eqlType === "EQ") {
      obj[key] = { $eq: val };
    } else {
      obj[key] = { $regex: val, $options: "i" };
    }
  }
  return obj;
}

function hashPassword(password: string): string {
  const saltRounds = config.bcrypt.salt;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function issueJwt(payload: Object, userSecretUuid: string = ""): string {
  return jwt.sign(payload, `${config.jwt.secretKey}${userSecretUuid}`, {
    expiresIn: config.jwt.expired,
  });
}

function tokenSplitter(token: string): Array<string> | undefined {
  const splitted = token.split(" ");
  if (!token || (splitted && splitted.length !== 2)) {
    return undefined;
  }
  return splitted;
}

function verifyJwt(
  token: string,
  userSecretUuid: string,
  cb: (
    decoded: jwt.JwtPayload | jwt.Jwt | undefined | string,
    errorMessage: string | undefined
  ) => void
): void {
  const secretKey = `${config.jwt.secretKey}${userSecretUuid}`;
  return jwt.verify(
    token,
    secretKey,
    {},
    (err: any, decoded: jwt.JwtPayload | jwt.Jwt | undefined | string) => {
      if (err) {
        if (err.message.includes("invalid signature")) {
          return cb(undefined, err.message.replace(" ", "-"));
        }
        return cb(undefined, "invalid-token");
      }
      return cb(decoded, undefined);
    }
  );
}

function sanitizerPayload(payload: Record<string, any>) {
  delete payload.createdBy;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.id;
  delete payload._id;
  return payload;
}

function validatorSchema<T>(schema: Joi.Schema) {
  return (
    payload: any
  ): {
    error: Array<string>;
    value: T | undefined;
  } => {
    const { error, value } = schema.validate(payload, { abortEarly: false });
    let messages: Array<string> = [];
    if (error !== undefined) {
      messages = error.details.map((e: Joi.ValidationErrorItem) => e.message);
    }
    return {
      error: messages,
      value,
    };
  };
}

async function paginationBuilder<T>(
  loader: (skip: number) => Promise<{ data: Array<T>; total: number }>,
  limit: number = 10,
  page: number = 1
) {
  page = page > 0 ? page : 1;
  const skip = limit * (page - 1);

  /** Load data callback */
  const { data, total } = await loader(skip);
  const pageCount = Math.ceil(total / limit);

  let nextPage: number | null = null;
  let prevPage: number | null = null;
  if (page <= pageCount) {
    nextPage = page + 1 <= pageCount ? page + 1 : null;
    prevPage = page - 1 > 0 ? page - 1 : null;
  }

  return {
    page: {
      prevPage,
      page,
      nextPage,
      limit,
      pageCount,
      total,
    },
    data,
  };
}

function objBuilder(data: Object | null): Object {
  /** Use to make object with only have attribute not null */
  const obj: Record<string, any> = {};
  if (data === null) return obj;
  for (const [key, val] of Object.entries(data)) {
    if (val) obj[key] = val;
  }
  return obj;
}

function getExpiredToken(token: string) {
  const decoded: any = jwt.decode(token);
  return moment.unix(decoded.exp);
}

export {
  responseBuilder,
  queriesBuilder,
  hashPassword,
  comparePassword,
  issueJwt,
  verifyJwt,
  tokenSplitter,
  sanitizerPayload,
  validatorSchema,
  paginationBuilder,
  objBuilder,
  getExpiredToken,
};
