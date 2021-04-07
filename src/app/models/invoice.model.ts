import { Customer } from './customer.model';
import { InvoiceItem } from './invoice-item.model';

export interface Invoice {
  id: string;
  code: string;
  hideTax: boolean;
  customer: Customer;
  createdAt: number;
  items: InvoiceItem[];
  updatedAt: number;
  completedAt: number;
}
