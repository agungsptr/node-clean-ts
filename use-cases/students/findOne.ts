import studentsDa from "../../data-access/students";

async function findOne(id: string) {
  return studentsDa.findOne(id);
};

export default findOne;
