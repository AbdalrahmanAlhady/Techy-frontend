import { Order } from './Order';
import { Product } from './Product';

export interface OrderItem {
  id?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
  productId: string;
  order?: Order;
  orderId?: string;
}
