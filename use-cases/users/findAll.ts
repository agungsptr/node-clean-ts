import usersDA from "../../data-access/users";
import {
  ifFalseThrowError,
  isEmpty,
  isValidObjectId,
} from "../../commons/checks";
import { paginationBuilder } from "../../commons/utils";

async function findAll(
  queries?: Record<string, string | number | boolean | Date>,
  limit: number = 10,
  page: number = 1
) {
  const loader = async (skip: number) => {
    if (queries !== undefined) {
      const { id, username, ...q } = queries;
      const eq: Record<string, string | number | boolean | Date> = {};
      if ("id" in queries) {
        ifFalseThrowError(isValidObjectId(String(id)), "id is not valid");
        eq.id = id;
      }
      if (!isEmpty(username)) {
        eq.username = username;
      }
      return usersDA.findAll({ like: q, eq }, { limit, skip });
    }
    return usersDA.findAll();
  };
  return paginationBuilder(loader, limit, page);
}

export default findAll;
