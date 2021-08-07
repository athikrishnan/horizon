import { ProductVariant } from './product-variant.model';
import { Product } from './product.model';

export interface SaleReturnItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  price: number;
  quantity: number;
  cgst: number;
  sgst: number;
  createdAt: number;
  updatedAt: number;
}
