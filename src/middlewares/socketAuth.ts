import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config";

export const socketAuth = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    // const token = socket.handshake.auth.token;
    // if (!token) {
    //   throw new Error("Authentication error");
    // }

    // const decoded = verifyToken(token, "access");
    // const user = await prisma.user.findUnique({
    //   where: { id: decoded.sub },
    // });

    // if (!user) {
    //   throw new Error("User not found");
    // }

    // socket.data.user = user;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};
