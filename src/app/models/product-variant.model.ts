import { Pack } from './pack.model';

export interface ProductVariant {
  size: number;
  price: number;
  packs: Pack[];
}
