import { Request, Response } from "express";
import { ResponseMessage, StatusCode } from "../../../commons/constants";
import { responseWithError } from "../../../commons/errors";
import { responseBuilder, sanitizerPayload } from "../../../commons/utils";
import { UseCaseInterface } from "../../../use-cases/useCase";

function Controller<T>(useCase: UseCaseInterface<T>) {
  async function create(req: Request, res: Response) {
    try {
      const payload = sanitizerPayload(req.body);
      payload.createdBy = req.body.user;
      const data = await useCase.create(payload);
      res.status(StatusCode.OK).send(
        responseBuilder<T>({
          statusCode: StatusCode.OK,
          message: ResponseMessage.Added,
          data,
        })
      );
      return;
    } catch (e) {
      responseWithError(res, e, StatusCode.BadRequest);
    }
  }

  async function findAll(req: Request, res: Response) {
    try {
      const { limit, page, ...q } = req.query;
      const result = await useCase.findAll(
        Object(q),
        limit ? Number(limit) : undefined,
        page ? Number(page) : undefined
      );
      res.status(StatusCode.OK).send(
        responseBuilder<T>({
          statusCode: StatusCode.OK,
          message: ResponseMessage.Loaded,
          ...result,
        })
      );
      return;
    } catch (e) {
      responseWithError(res, e, StatusCode.BadRequest);
    }
  }

  async function findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await useCase.findOne(id);
      res.status(StatusCode.OK).send(
        responseBuilder<T>({
          statusCode: StatusCode.OK,
          message: ResponseMessage.Loaded,
          data,
        })
      );
      return;
    } catch (e) {
      responseWithError(res, e, StatusCode.BadRequest);
    }
  }

  async function update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = sanitizerPayload(req.body);
      const data = await useCase.update(id, payload);
      res.status(StatusCode.OK).send(
        responseBuilder<T>({
          statusCode: StatusCode.OK,
          message: ResponseMessage.Updated,
          data,
        })
      );
      return;
    } catch (e) {
      responseWithError(res, e, StatusCode.BadRequest);
    }
  }

  async function remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await useCase.remove(id);
      res.status(StatusCode.OK).send(
        responseBuilder<T>({
          statusCode: StatusCode.OK,
          message: ResponseMessage.Removed,
        })
      );
      return;
    } catch (e) {
      responseWithError(res, e, StatusCode.BadRequest);
    }
  }

  return {
    create,
    findAll,
    findOne,
    update,
    remove,
  };
}

export default Controller;
