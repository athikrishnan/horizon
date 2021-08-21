import { Supplier } from './supplier.model';
import { PurchaseItem } from './purchase-item.model';

export interface Purchase {
  id: string;
  code: string;
  supplier: Supplier;
  date: any;
  items: PurchaseItem[];
  total: number;
  totalCgst: number;
  totalSgst: number;
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
