import { OrderItem } from './OrderItem';
import { User } from './User';
enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
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
