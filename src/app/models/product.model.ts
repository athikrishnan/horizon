import { ProductUnit } from '../enums/product-unit.enum';

export interface Product {
  id: string;
  name: string;
  hsn: number;
  unit: ProductUnit;
  keywords: string[];
  createdAt: number;
  updatedAt: number;
}
