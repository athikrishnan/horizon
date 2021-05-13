import { TransactionType } from '../enums/transaction-type.enum';
import { User } from './user.model';

export interface Transaction {
  id: string;
  type: TransactionType;
  isDebit: boolean;
  other?: string;
  amount: number;
  date: any;
  dateKeywords: string[];
  comments?: string;
  createdBy: User;
  createdAt: number;
  updatedAt: number;
}
