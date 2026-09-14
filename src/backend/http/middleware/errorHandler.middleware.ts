import type { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): { status: "fail"; message: string; errors?: Record<string, any> } {
  if (err instanceof ZodError) {
    return {
      status: "fail",
      message: err.message,
      errors: z.flattenError(err),
    };
  }
  return {
    status: "fail",
    message: `the server didn't behaved correctly`,
  };
}
