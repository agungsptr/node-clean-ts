import usersDA from "../../data-access/users";
import {
  ifFalseThrowError,
  isEmpty,
  isValidObjectId,
} from "../../commons/checks";
import { paginationBuilder } from "../../commons/utils";

async function findAll(
  queries: Record<string, any>,
  limit: number,
  page: number
) {
  const { id, username, ...q } = queries;
  const eq: Record<string, any> = {};
  if ("id" in queries) {
    ifFalseThrowError(isValidObjectId(id), "id is not valid");
    eq.id = id;
  }
  if (!isEmpty(username)) {
    eq.username = username;
  }

  const loader = async (skip: number) => {
    return usersDA.findAll({ like: q, eq }, { limit, skip });
  };
  return paginationBuilder(loader, limit, page);
}

export default findAll;
