import { Server } from "socket.io";

export class SocketService {
  private static io: Server;

  static initialize(io: Server) {
    this.io = io;
  }

  static emitNewMessage(chatId: string, message: any) {
    this.io.to(`chat:${chatId}`).emit("new_message", message);
  }

  static emitNewNotification(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit("new_notification", notification);
  }

  static emitProjectUpdate(projectId: string, update: any) {
    this.io.to(`project:${projectId}`).emit("project_update", update);
  }

  static emitUserStatus(userId: string, status: "online" | "offline") {
    this.io.emit("user_status", { userId, status });
  }

  static emitTypingStatus(chatId: string, userId: string, isTyping: boolean) {
    this.io.to(`chat:${chatId}`).emit("typing_status", {
      userId,
      chatId,
      isTyping,
    });
  }
}
