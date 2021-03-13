import { Pack } from './pack.model';

export interface ProductVariant {
  id: string;
  size: number;
  price: number;
  quantity: number;
  packs: Pack[];
  createdAt: number;
  updatedAt: number;
}
