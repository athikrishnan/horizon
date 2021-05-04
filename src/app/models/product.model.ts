import { ProductUnit } from '../enums/product-unit.enum';
import { ProductImage } from './product-image.model';
import { ProductVariant } from './product-variant.model';
import { Slab } from './slab.model';

export interface Product {
  id: string;
  code: number;
  name: string;
  slab: Slab;
  unit: ProductUnit;
  images: ProductImage[];
  keywords: string[];
  variants: ProductVariant[];
  createdAt: number;
  updatedAt: number;
}
