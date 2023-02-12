import { Student } from "../../models/student";

function serializeSingle(data?: Record<string, any>): Student {
  return {
    id: data?._id,
    grade: data?.grade,
    name: data?.name,
    age: data?.age,
    perfect: data?.perfect,
    createdBy: data?.createdBy,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
}

export default serializeSingle;
