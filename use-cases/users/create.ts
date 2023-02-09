import usersDA from "../../data-access/users";

async function create(payload: any) {
  return usersDA.create(payload);
};

export default create;
