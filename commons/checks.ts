import CustomError from "./customError";
import mongoose from "mongoose";

function isEmpty(obj: any) {
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

function ifEmptyThrowError(obj: any, errorMsg: string) {
  if (isEmpty(obj)) {
    throw new CustomError(errorMsg);
  }
}

function ifFalseThrowError(flag: boolean, errorMsg: string) {
  if (flag === false) {
    throw new CustomError(errorMsg);
  }
}

function ifTrueThrowError(flag: boolean, errorMsg: string) {
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

function isValidObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export {
  ifTrueThrowError,
  ifFalseThrowError,
  imageFileTypeIsValid,
  isEmpty,
  ifEmptyThrowError,
  isValidObjectId,
};
