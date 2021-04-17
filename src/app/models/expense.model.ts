import { ExpenseType } from '../enums/expense-type.enum';
import { User } from './user.model';

export interface Expense {
  id: string;
  type: ExpenseType;
  other?: string;
  amount: number;
  date: any;
  comments?: string;
  createdBy: User;
  createdAt: number;
  updatedAt: number;
}
