import { Customer } from './customer.model';
import { SaleReturnItem } from './sale-return-item.model';

export interface SaleReturn {
  id: string;
  code: string;
  customer: Customer;
  createdAt: number;
  items: SaleReturnItem[];
  total: number;
  totalCgst: number;
  totalSgst: number;
  updatedAt: number;
  completedAt: number;
}
