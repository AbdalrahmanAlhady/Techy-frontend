import { Product } from "./Product";

export interface Brand {
  id?: string;
  name: String;
  products?: Product[];
}
