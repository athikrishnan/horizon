import { BrandType } from '../enums/brand-type.enum';
import { ProductUnit } from '../enums/product-unit.enum';
import { ProductImage } from './product-image.model';
import { ProductVariant } from './product-variant.model';
import { Slab } from './slab.model';

export interface Product {
  id: string;
  brand: BrandType;
  code: number;
  name: string;
  category: string;
  slab: Slab;
  size: number;
  unit: ProductUnit;
  images: ProductImage[];
  keywords: string[];
  variants: ProductVariant[];
  createdAt: number;
  updatedAt: number;
}
