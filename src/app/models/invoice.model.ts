import { Customer } from './customer.model';
import { InvoiceItem } from './invoice-item.model';

export interface Invoice {
  id: string;
  code: string;
  hideTax: boolean;
  customer: Customer;
  createdAt: number;
  items: InvoiceItem[];
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
