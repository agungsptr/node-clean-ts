import { serializer } from "../../commons/utils";

function serializeSingle(data?: Record<string, any>) {
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

export default serializer(serializeSingle);
