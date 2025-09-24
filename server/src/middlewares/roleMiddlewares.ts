import { Request, Response, NextFunction } from "express";

export const hasAccess = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
