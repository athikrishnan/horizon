import { Customer } from './customer.model';
import { QuoteItem } from './quote-item.model';

export interface Quote {
  id: string;
  code: string;
  hideTax: boolean;
  customer: Customer;
  createdAt: number;
  items: QuoteItem[];
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
