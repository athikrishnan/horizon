import { ProductUnit } from '../enums/product-unit.enum';
import { ProductVariant } from './product-variant.model';

export interface Product {
  id: string;
  name: string;
  hsn: number;
  unit: ProductUnit;
  keywords: string[];
  variants: ProductVariant[];
  createdAt: number;
  updatedAt: number;
}
