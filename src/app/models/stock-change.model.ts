import { ProductVariant } from './product-variant.model';
import { Product } from './product.model';
import { User } from './user.model';

export interface StockChange {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  isDebit: boolean;
  changedBy: User;
  updatedAt: number;
  createdAt: number;
}
