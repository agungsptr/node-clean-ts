import Joi from "joi";
import mongoose from "mongoose";
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
  data?: Object | Array<Object> | null;
  page?: Page;
};

type ModelBuilder = (payload: any) => Joi.AnySchema<any> | undefined;

type Model = mongoose.Model<any>;

type Serializer = (data: any) => Object | null;

export { Page, Response, ModelBuilder, Model, Serializer };
