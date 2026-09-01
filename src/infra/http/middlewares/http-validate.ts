import { BadRequestError } from "@/core/errors/bad-request.error";
import { FastifyRequest } from "fastify";
import { AnyObjectSchema, ValidationError } from "yup";

export const httpValidate = (schema: AnyObjectSchema) => async (req: FastifyRequest) => {
  try {
    const validatedData = await schema.validate(
      { body: req.body, query: req.query, params: req.params },
      { abortEarly: false, stripUnknown: false },
    );

    req.body = validatedData.body;
    req.query = validatedData.query;
    req.params = validatedData.params;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new BadRequestError(error.errors.join(", "));
    }
    throw error;
  }
};
