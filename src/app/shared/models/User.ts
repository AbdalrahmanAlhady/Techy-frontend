import { Product } from "./Product";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  otp: string;
  role: string;
  products?: Product[]
}
