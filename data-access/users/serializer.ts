import { User } from "../../models/user";

function serializeSingle(data: Record<string, any>): User {
  const result = {
    id: data._id,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
  return result;
}

export default serializeSingle;
