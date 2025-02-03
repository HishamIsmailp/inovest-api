import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../utils";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Something went wrong!" });
};
