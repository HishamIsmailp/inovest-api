import { Role, MessageType, ProjectStatus } from "@prisma/client";

export interface UpdateProfileDto {
  name?: string;
  imageUrl?: string;
}

export interface UpdateRoleDto {
  role: Role;
}

export interface SendMessageDto {
  content: string;
  messageType: MessageType;
}

export interface UpdateStatusDto {
  status: ProjectStatus;
}
