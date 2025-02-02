import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "object" && decoded !== null) {
      req.user = decoded as { id: string; role?: string };
      next();
    } else {
      return res.status(401).json({ message: "Invalid token format" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
