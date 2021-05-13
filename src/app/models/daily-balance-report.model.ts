import { Expense } from './expense.model';
import { Transaction } from './transaction.model';

export interface DailyBalanceReport {
  id: string;
  incomes: Transaction[];
  expenses: Expense[];
  totalExpense: number;
  totalIncome: number;
  balance: number;
  updatedAt: number;
  createdAt: number;
}
