import { Brand } from './Brand';
import { Category } from './Category';
import { User } from './User';

export interface Product {
  id: string;
  name: string;
  cover: string;
  description: string;
  inventory: number;
  price: number;
  brand: Brand;
  category: Category;
  vendor: User;
}
