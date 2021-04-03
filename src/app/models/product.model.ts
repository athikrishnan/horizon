import { ProductUnit } from '../enums/product-unit.enum';
import { ProductVariant } from './product-variant.model';
import { Slab } from './slab.model';

export interface Product {
  id: string;
  name: string;
  slab: Slab;
  unit: ProductUnit;
  keywords: string[];
  variants: ProductVariant[];
  createdAt: number;
  updatedAt: number;
}
