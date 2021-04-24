import { Customer } from './customer.model';
import { ProformaItem } from './proforma-item.model';

export interface Proforma {
  id: string;
  code: string;
  hideTax: boolean;
  customer: Customer;
  createdAt: number;
  items: ProformaItem[];
  hasDiscount: boolean;
  discount?: number;
  discountAmount?: number;
  subTotal: number;
  total: number;
  totalCgst: number;
  totalSgst: number;
  updatedAt: number;
  completedAt: number;
}
