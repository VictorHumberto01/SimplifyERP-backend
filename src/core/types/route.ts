import { FastifyInstance } from "fastify";

export interface IRoute {
  path: string;
  route: (app: FastifyInstance) => Promise<void>;
}
