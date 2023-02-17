import { Page, Payload } from "../commons/type";

interface UseCaseInterface<T> {
  create(payload: Payload): Promise<T>;
  findOne(id: string): Promise<T>;
  findAll(
    queries?: Record<string, string | number | boolean | Date>,
    limit?: number,
    page?: number
  ): Promise<{ page: Page; data: Array<T> }>;
  update(id: string, payload: Payload): Promise<T>;
  remove(id: string): Promise<void>;
}

export { UseCaseInterface };
