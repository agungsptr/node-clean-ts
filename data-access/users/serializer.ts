import { serializer } from "../../commons/utils";

function serializeSingle(data?: Record<string, any>) {
  return {
    id: data?._id,
    firstName: data?.firstName,
    lastName: data?.lastName,
    username: data?.username,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
}

export default serializer(serializeSingle);
