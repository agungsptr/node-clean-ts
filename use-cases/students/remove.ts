import studentsDa from "../../data-access/students";

async function remove(id: string) {
  return studentsDa.remove(id);
}

export default remove;
