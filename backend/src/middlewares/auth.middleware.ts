import { Request, Response, NextFunction } from "express";
import { UnauthorizedException, ForbiddenException } from "../utils/app-error"; 

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; 
    

    if (!user) {
      throw new UnauthorizedException("Bạn chưa đăng nhập");
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException("Bạn không có quyền truy cập");
    }

    next(); 
  };
};
