import { ProductVariant } from './product-variant.model';
import { Product } from './product.model';

export interface PickedProduct {
  product: Product;
  variant: ProductVariant;
}
