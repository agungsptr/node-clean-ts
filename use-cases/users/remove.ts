import usersDa from "../../data-access/users";

async function remove(id: string) {
  return usersDa.remove(id);
}

export default remove;
