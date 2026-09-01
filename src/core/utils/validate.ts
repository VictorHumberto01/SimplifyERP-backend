import { Schema, ValidationError } from "yup";
import { BadRequestError } from "../errors/bad-request.error";

export async function validate(schema: Schema<unknown>, data: unknown, error?: Error) {
  try {
    await schema.validate(data, { abortEarly: false });
  } catch (validationError) {
    if (error) throw error;
    if (validationError instanceof ValidationError) {
      throw new BadRequestError(validationError.errors.join(", "));
    }
    throw validationError;
  }
}
