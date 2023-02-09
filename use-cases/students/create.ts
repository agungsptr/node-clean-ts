import studentsDA from "../../data-access/students";

async function create(payload: any) {
  return studentsDA.create(payload);
};

export default create;
