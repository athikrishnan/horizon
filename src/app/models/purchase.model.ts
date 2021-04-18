import { Supplier } from './supplier.model';
import { PurchaseItem } from './purchase-item.model';

export interface Purchase {
  id: string;
  code: string;
  hideTax: boolean;
  supplier: Supplier;
  createdAt: number;
  items: PurchaseItem[];
  total: number;
  totalCgst: number;
  totalSgst: number;
  updatedAt: number;
  completedAt: number;
}
