import usersDa from "../../data-access/users";

async function findOne(id: string) {
  return usersDa.findOne(id);
};

export default findOne;
