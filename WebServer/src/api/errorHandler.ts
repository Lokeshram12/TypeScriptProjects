import type {Request, Response ,NextFunction} from "express";

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 400;
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.log(err);
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || "Something went wrong on our end";
  res.status(statusCode).json({
    "error": message
  });
}

