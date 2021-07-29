import { Pack } from './pack.model';

export interface ProductVariant {
  id: string;
  name: string;
  size: number;
  price: number;
  buyingPrice: number;
  dealerPrice: number;
  quantity: number;
  packs: Pack[];
  createdAt: number;
  updatedAt: number;
}
