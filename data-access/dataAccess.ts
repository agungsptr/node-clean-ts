import { SortOrder } from "mongoose";
import {
  ifEmptyThrowError,
  ifFalseThrowError,
  isValidObjectId,
} from "../commons/checks";
import { QueryOP } from "../commons/constants";
import { repackageError } from "../commons/errors";
import { Model, ModelBuilder, Serializer } from "../commons/type";
import { queriesBuilder } from "../commons/utils";

class DataAccess {
  protected model: Model;
  protected modelName: string;
  protected builder: ModelBuilder;
  protected serializer: Serializer;

  constructor(
    model: Model,
    modelName: string,
    builder: ModelBuilder,
    serializer: Serializer
  ) {
    this.model = model;
    this.modelName = modelName;
    this.builder = builder;
    this.serializer = serializer;
  }

  async create(payload: any) {
    try {
      const data = this.builder(payload);
      return this.model.create(data).then(this.serializer);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findOne(id: string) {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      return this.model.findById(id).then(this.serializer);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findOneBy(
    queries: { eq?: Object; like?: Object },
    options: { orderBy?: { [key: string]: SortOrder } }
  ) {
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
    queries: { eq?: Object; like?: Object },
    options: {
      orderBy?: { [key: string]: SortOrder };
      limit: number;
      skip: number;
    }
  ) {
    try {
      const data = await this.model
        .find(queriesBuilder(QueryOP.EQ, queries.eq))
        .find(queriesBuilder(QueryOP.LIKE, queries.like))
        .sort(options.orderBy)
        .limit(options.limit)
        .skip(options.skip)
        .then(this.serializer);
      const total = await this.model
        .count(queriesBuilder(QueryOP.EQ, queries.eq))
        .count(queriesBuilder(QueryOP.LIKE, queries.like));
      return { data, total };
    } catch (e) {
      throw repackageError(e);
    }
  }

  async update(id: string, payload: any) {
    try {
      ifFalseThrowError(isValidObjectId(id), "id is not valid");
      const data = await this.model.findById(id).then(this.serializer);
      ifEmptyThrowError(
        data,
        `Data with id: ${id} in ${this.modelName} is not found`
      );
      const dataToUpdate = this.builder({ ...data, ...payload });
      await this.model.findByIdAndUpdate(id, dataToUpdate);
      return { id, ...dataToUpdate };
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
        `Data with id: ${id} in ${this.modelName} is not found`
      );
      await this.model.findByIdAndDelete(id);
      return null;
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

export default DataAccess;
