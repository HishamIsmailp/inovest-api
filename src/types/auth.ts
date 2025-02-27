import { Role } from "@prisma/client";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role?: string;
}
