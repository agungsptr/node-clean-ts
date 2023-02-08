import CustomError from "./customError";
import { ObjectId, Types } from "mongoose";

const ObjectId = Types.ObjectId;

function isArray(data: any): boolean {
  return Array.isArray(data);
}

function isEmpty(obj: any): boolean {
  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  } else {
    if (
      obj === null ||
      obj === undefined ||
      typeof obj === "undefined" ||
      obj === "" ||
      obj === "undefined"
    ) {
      return true;
    }
  }
  return false;
}

function isEmail(email: string): boolean {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function ifEmptyThrowError(
  obj: string | Array<any> | null | undefined,
  errorMsg: string
) {
  if (isEmpty(obj)) {
    throw new CustomError(errorMsg);
  }
}

function ifFalseThrowError(flag: boolean, errorMsg: string): void {
  if (flag === false) {
    throw new CustomError(errorMsg);
  }
}

function ifNotEmptyThrowError(
  flag: string | Array<any> | null | undefined,
  errorMsg: string
): void {
  if (!isEmpty(flag)) {
    throw new CustomError(errorMsg);
  }
}

function ifTrueThrowError(flag: boolean, errorMsg: string): void {
  if (flag === true) {
    throw new CustomError(errorMsg);
  }
}

function imageFileTypeIsValid(file: any) {
  return (
    file &&
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpg" &&
    file.mimetype !== "image/jpeg"
  );
}

function isValidObjId(id: any): boolean {
  if (id instanceof ObjectId) return true;
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    }
  }
  return false;
}

export {
  isArray,
  isEmpty,
  isEmail,
  ifEmptyThrowError,
  ifNotEmptyThrowError,
  ifTrueThrowError,
  ifFalseThrowError,
  imageFileTypeIsValid,
  isValidObjId,
};
