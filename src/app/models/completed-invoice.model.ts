import { Invoice } from './invoice.model';
import { User } from './user.model';

export interface CompletedInvoice {
  id: string;
  invoice: Invoice;
  completedBy: User;
  createdAt: number;
  updatedAt: number;
}
