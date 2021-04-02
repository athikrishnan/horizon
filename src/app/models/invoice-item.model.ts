import { Pack } from './pack.model';
import { ProductVariant } from './product-variant.model';
import { Product } from './product.model';

export interface InvoiceItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  pack: Pack;
  price: number;
  quantity: number;
  createdAt: number;
  updatedAt: number;
}
