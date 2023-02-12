import mongoose, { SortOrder } from "mongoose";
import {
  ifEmptyThrowError,
  ifFalseThrowError,
  isValidObjectId,
} from "../commons/checks";
import { QueryOP } from "../commons/constants";
import { repackageError } from "../commons/errors";
import { Payload } from "../commons/type";
import { queriesBuilder } from "../commons/utils";

interface DataAccessInterface<T> {
  create(payload: Payload): Promise<T>;
  findOne(id: string): Promise<T>;
  findOneBy(
    queries: { eq?: Object; like?: Object },
    options: { orderBy?: { [key: string]: SortOrder } }
  ): Promise<T>;
  findAll(
    queries: { eq?: Object; like?: Object },
    options: {
      orderBy?: { [key: string]: SortOrder };
      limit: number;
      skip: number;
    }
  ): Promise<{ data: Array<T>; total: number }>;
  update(id: string, payload: Payload): Promise<T>;
  remove(id: string): Promise<void>;
  removeAll(): Promise<void>;
}

class DataAccess<T> implements DataAccessInterface<T> {
  protected model: mongoose.Model<any>;
  protected modelName: string;
  protected builder: (payload: Payload) => T | undefined;
  protected serializer: (payload: Payload) => T;

  constructor(
    model: mongoose.Model<any>,
    modelName: string,
    builder: (payload: Payload) => T | undefined,
    serializer: (payload: Payload) => T
  ) {
    this.model = model;
    this.modelName = modelName;
    this.builder = builder;
    this.serializer = serializer;
  }

  async create(payload: Payload): Promise<T> {
    try {
      const data = this.builder(payload);
      return this.model.create(data).then(this.serializer);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findOne(id: string): Promise<T> {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      return this.model.findById(id).then(this.serializer);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findOneBy(
    queries: { eq?: Object; like?: Object },
    options: { orderBy?: { [key: string]: SortOrder } } = {
      orderBy: { createdAt: 1 },
    }
  ): Promise<T> {
    try {
      return this.model
        .findOne(queriesBuilder(QueryOP.EQ, queries.eq))
        .findOne(queriesBuilder(QueryOP.LIKE, queries.like))
        .sort(options.orderBy)
        .then(this.serializer);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findAll(
    queries: { eq?: Object; like?: Object } = {},
    options: {
      orderBy?: { [key: string]: SortOrder };
      limit: number;
      skip: number;
    } = { orderBy: { createdAt: 1 }, limit: 10, skip: 0 }
  ): Promise<{ data: Array<T>; total: number }> {
    try {
      const data = await this.model
        .find(queriesBuilder(QueryOP.EQ, queries.eq))
        .find(queriesBuilder(QueryOP.LIKE, queries.like))
        .sort(options.orderBy)
        .limit(options.limit)
        .skip(options.skip)
        .then((list) => list.map((d) => this.serializer(d)));
      const total = await this.model
        .count(queriesBuilder(QueryOP.EQ, queries.eq))
        .count(queriesBuilder(QueryOP.LIKE, queries.like));
      return { data, total };
    } catch (e) {
      throw repackageError(e);
    }
  }

  async update(id: string, payload: Payload): Promise<T> {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      const data = await this.model.findById(id).then(this.serializer);
      ifEmptyThrowError(
        data,
        ` with id: ${id} in ${this.modelName} is not found`
      );
      const dataToUpdate = this.builder({ ...data, ...payload });
      await this.model.findByIdAndUpdate(id, Object(dataToUpdate));
      return this.serializer({ id, ...dataToUpdate });
    } catch (e) {
      throw repackageError(e);
    }
  }

  async remove(id: string) {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      const data = await this.model.findById(id).then(this.serializer);
      ifEmptyThrowError(
        data,
        ` with id: ${id} in ${this.modelName} is not found`
      );
      await this.model.findByIdAndDelete(id);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async removeAll() {
    try {
      await this.model.deleteMany();
    } catch (e) {
      throw repackageError(e);
    }
  }
}

export { DataAccess, DataAccessInterface };
