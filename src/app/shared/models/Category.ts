import { Product } from "./Product";

export interface Category {
    id?: string;
    name: String;
    products?: Product[];
  }
  