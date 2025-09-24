import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

interface RequestUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Token expired" });
        return;
      }
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
      }
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
      return;
    }

    if (typeof decoded === "string" || !decoded.id) {
      res
        .status(401)
        .json({ success: false, message: "Invalid token structure" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
