import { Request } from "express";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description?: string;
  status: string;
  accountId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
