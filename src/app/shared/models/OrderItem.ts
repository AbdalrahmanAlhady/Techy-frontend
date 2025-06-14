import { Order } from './Order';
import { Product } from './Product';

export interface OrderItem {
  id?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: string;
  product?: Product;
  order?: Order;
  orderId?: string;
}
