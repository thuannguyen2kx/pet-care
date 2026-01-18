import { NextFunction, Request, Response } from "express";

export const postContext = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.contentType = "Post";
  next();
};
