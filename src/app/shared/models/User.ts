import { Product } from "./Product";
export enum UserRole {
  BUYER = "BUYER",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  role: UserRole;
  otp?: string;
  products?: Product[]
}
