import mongoose, { SortOrder } from "mongoose";
import { isEmpty, isValidObjectId } from "../commons/checks";
import { ErrorName, QueryOP } from "../commons/constants";
import CustomError from "../commons/customError";
import { repackageError } from "../commons/errors";
import { Payload } from "../commons/type";
import { queriesBuilder } from "../commons/utils";

interface DataAccessInterface<T> {
  create(payload: Payload): Promise<T>;
  findOne(id: string): Promise<T>;
  findOneBy(
    queries: { eq?: object; like?: object },
    options: { orderBy?: { [key: string]: SortOrder } }
  ): Promise<T>;
  findAll(
    queries: { eq?: object; like?: object },
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
  protected model: {
    model: mongoose.Model<mongoose.AnyExpression>;
    name: string;
    unique?: Array<string>;
  };
  protected builder: (payload: Payload) => T | undefined;
  protected serializer: (payload: Payload) => T;
  private errorMessage = (id: string) =>
    `With id: ${id} in ${this.model.name} is not found`;

  constructor(
    model: {
      model: mongoose.Model<mongoose.AnyExpression>;
      name: string;
      unique?: Array<string>;
    },
    builder: (payload: Payload) => T | undefined,
    serializer: (payload: Payload) => T
  ) {
    this.model = model;
    this.builder = builder;
    this.serializer = serializer;
  }

  async create(payload: Payload): Promise<T> {
    try {
      const data = this.builder(payload);
      if (this.model.unique && this.model.unique.length > 0) {
        for (const v of this.model.unique) {
          await this.model.model
            .findOne(queriesBuilder(QueryOP.EQ, { [v]: Object(data)[v] }))
            .then((data) => {
              if (!isEmpty(data))
                throw new CustomError(
                  ErrorName.DuplicateData,
                  `${v} with value: "${Object(data)[v]}" already exists`
                );
            });
        }
      }
      return this.model.model.create(data).then((data: Payload) => {
        if (!isEmpty(data)) return this.serializer(data);
        throw new CustomError(ErrorName.Null, "Empty data");
      });
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findOne(id: string): Promise<T> {
    try {
      if (!isValidObjectId(id)) {
        throw new CustomError(ErrorName.Invalid, "id is not valid");
      }
      return this.model.model.findById(id).then((data: Payload) => {
        if (!isEmpty(data)) return this.serializer(data);
        throw new CustomError(ErrorName.NotFound, this.errorMessage(id));
      });
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findOneBy(
    queries: { eq?: object; like?: object },
    options: { orderBy?: { [key: string]: SortOrder } } = {
      orderBy: { createdAt: 1 },
    }
  ): Promise<T> {
    try {
      return this.model.model
        .findOne(queriesBuilder(QueryOP.EQ, queries.eq))
        .findOne(queriesBuilder(QueryOP.LIKE, queries.like))
        .sort(options.orderBy)
        .then((data: Payload) => {
          if (!isEmpty(data)) return this.serializer(data);
          throw new CustomError(ErrorName.NotFound, "Data not found");
        });
    } catch (e) {
      throw repackageError(e);
    }
  }

  async findAll(
    queries: { eq?: object; like?: object } = {},
    options: {
      orderBy?: { [key: string]: SortOrder };
      limit: number;
      skip: number;
    } = { orderBy: { createdAt: 1 }, limit: 10, skip: 0 }
  ): Promise<{ data: Array<T>; total: number }> {
    try {
      const data = await this.model.model
        .find(queriesBuilder(QueryOP.EQ, queries.eq))
        .find(queriesBuilder(QueryOP.LIKE, queries.like))
        .sort(options.orderBy)
        .limit(options.limit)
        .skip(options.skip)
        .then((list) => list.map((d) => this.serializer(d)));
      const total = await this.model.model
        .count(queriesBuilder(QueryOP.EQ, queries.eq))
        .count(queriesBuilder(QueryOP.LIKE, queries.like));
      return { data, total };
    } catch (e) {
      throw repackageError(e);
    }
  }

  async update(id: string, payload: Payload): Promise<T> {
    try {
      if (!isValidObjectId(id)) {
        throw new CustomError(ErrorName.Invalid, "id is not valid");
      }
      const data = await this.model.model.findById(id).then((data: Payload) => {
        if (!isEmpty(data)) return this.serializer(data);
        return undefined;
      });
      if (!data) {
        throw new CustomError(ErrorName.NotFound, this.errorMessage(id));
      }
      const dataToUpdate = this.builder({ ...data, ...payload });
      await this.model.model.findByIdAndUpdate(id, Object(dataToUpdate));
      return this.serializer({ _id: id, ...dataToUpdate });
    } catch (e) {
      throw repackageError(e);
    }
  }

  async remove(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new CustomError(ErrorName.Invalid, "id is not valid");
      }
      const data = await this.model.model.findById(id).then((data: Payload) => {
        if (!isEmpty(data)) return this.serializer(data);
        return undefined;
      });
      if (!data) {
        throw new CustomError(ErrorName.NotFound, this.errorMessage(id));
      }
      await this.model.model.findByIdAndDelete(id);
    } catch (e) {
      throw repackageError(e);
    }
  }

  async removeAll() {
    try {
      await this.model.model.deleteMany();
    } catch (e) {
      throw repackageError(e);
    }
  }
}

export { DataAccess, DataAccessInterface };
