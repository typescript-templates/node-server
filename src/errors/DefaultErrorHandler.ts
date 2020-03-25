import { HttpStatusCode } from "@dotup/dotup-ts-types";
import { Request, Response, NextFunction } from "express";

export const DefaultErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal server error");
};