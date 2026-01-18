import { NextFunction, Request, Response } from "express";

export const commentContext = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.contentType = "Comment";
  next();
};
