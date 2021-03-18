import { Customer } from './customer.model';

export interface Invoice {
  id: string;
  code: string;
  customer: Customer;
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
