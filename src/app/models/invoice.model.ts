import { Customer } from './customer.model';
import { InvoiceItem } from './invoice-item.model';

export interface Invoice {
  id: string;
  code: string;
  customer: Customer;
  createdAt: number;
  items: InvoiceItem[];
  updatedAt: number;
  completedAt: number;
}
