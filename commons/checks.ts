import mongoose from "mongoose";

function isEmpty(data: [] | string | number | boolean | Date | Object) {
  if (Array.isArray(data) && data.length === 0) {
    return true;
  } else {
    return (
      data === "" || data === "undefined" || data === undefined || data === null
    );
  }
}

function isValidObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export { isEmpty, isValidObjectId };
