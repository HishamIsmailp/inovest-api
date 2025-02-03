import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuth } from "../middlewares/socketAuth";
import { SocketService } from "../services/socketService";
import prisma from "./database";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuth);

  const onlineUsers = new Map<string, string>();
  const typingUsers = new Map<string, { chatId: string; timestamp: number }>();

  io.on("connection", async (socket) => {
    const userId = socket.data.user.id;
    console.log("Client connected:", socket.id);

    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);

    SocketService.emitUserStatus(userId, 'online');

    await prisma.user.update({
      where: { id: userId },
      data: {
        lastSeen: new Date()
      }
    });

    socket.on("join_chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("typing_start", (chatId: string) => {
      typingUsers.set(userId, { chatId, timestamp: Date.now() });
      SocketService.emitTypingStatus(chatId, userId, true);
    });

    socket.on("typing_end", (chatId: string) => {
      typingUsers.delete(userId);
      SocketService.emitTypingStatus(chatId, userId, false);
    });

    socket.on("join_project", (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("project_update", (projectId: string, update: any) => {
      SocketService.emitProjectUpdate(projectId, update);
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      
      onlineUsers.delete(userId);
      typingUsers.delete(userId);
      
      SocketService.emitUserStatus(userId, 'offline');

      await prisma.user.update({
        where: { id: userId },
        data: {
          lastSeen: new Date()
        }
      });
    });
  });

  setInterval(() => {
    const now = Date.now();
    typingUsers.forEach((data, userId) => {
      if (now - data.timestamp > 5000) {
        typingUsers.delete(userId);
        SocketService.emitTypingStatus(data.chatId, userId, false);
      }
    });
  }, 5000);

  return io;
};
