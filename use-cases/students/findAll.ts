import studentsDA from "../../data-access/students";
import { paginationBuilder } from "../../commons/utils";

async function findAll(
  queries: Record<string, any>,
  limit: number,
  page: number
) {
  const loader = async (skip: number) => {
    return studentsDA.findAll({ like: queries }, { limit, skip });
  };
  return paginationBuilder(loader, limit, page);
}

export default findAll;
