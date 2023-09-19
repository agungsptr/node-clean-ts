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
  data?: object;
  page?: Page;
};

type GrpcQuery = {
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
};

type Payload = Record<string, string | number | boolean | Date | object>;

export { Page, Response, GrpcQuery, Payload };
