import { Customer } from './customer.model';
import { Invoice } from './invoice.model';
import { User } from './user.model';

export interface InvoicePayment {
  id: string;
  invoice: Invoice;
  amount: number;
  paidBy: Customer;
  recievedBy: User;
  date: any;
  dateKeywords: string[];
  createdAt: number;
  updatedAt: number;
}
