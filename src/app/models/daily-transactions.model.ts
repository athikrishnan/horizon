import { Transaction } from './transaction.model';

export interface DailyTransactions {
  id: string;
  transactions: Transaction[];
  totalExpense: number;
  totalIncome: number;
  balance: number;
  updatedAt: number;
  createdAt: number;
}
