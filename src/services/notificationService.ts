import nodemailer from "nodemailer";
import * as admin from "firebase-admin";
import { prisma } from "../config";
import { SocketService } from "./socketService";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export class NotificationService {
  static async sendEmail(to: string, subject: string, html: string) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  static async sendPushNotification(
    userId: string,
    title: string,
    body: string
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fcmToken: true, email: true },
      });

      if (user?.fcmToken) {
        await admin.messaging().send({
          token: user.fcmToken,
          notification: {
            title,
            body,
          },
          android: {
            priority: "high",
          },
        });
        console.log("Push notification sent successfully");
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }

  static async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: string
  ) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
        },
      });

      SocketService.emitNewNotification(userId, notification);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user?.email) {
        await this.sendEmail(
          user.email,
          title,
          `<h1>${title}</h1><p>${message}</p>`
        );
      }

      await this.sendPushNotification(userId, title, message);

      return notification;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  static async updateFcmToken(userId: string, token: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  }
}
