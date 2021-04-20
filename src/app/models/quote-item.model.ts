import { Pack } from './pack.model';
import { ProductVariant } from './product-variant.model';
import { Product } from './product.model';

export interface QuoteItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  pack: Pack;
  price: number;
  quantity: number;
  cgst: number;
  sgst: number;
  createdAt: number;
  updatedAt: number;
}