import { OrderItem } from './OrderItem';
import { User } from './User';

export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}
export interface Order {
  id: string;
  orderStatus: OrderStatus;
  deliveryFee: number;
  totalAmount: number;
  address: string;
  userId: string;
  user?: User; 
  orderItems?: OrderItem[];
}
