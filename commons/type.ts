import { Status, StatusCode } from "./constants";

type Page = {
  prevPage: number | null;
  page: number;
  nextPage: number | null;
  limit: number;
  pageCount: number;
  total: number;
};

type Response = {
  statusCode: StatusCode;
  status: Status;
  message: string | Array<string>;
  data?: Object;
  page?: Page;
};

type GrpcQuery = {
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
};

export { Page, Response, GrpcQuery };
