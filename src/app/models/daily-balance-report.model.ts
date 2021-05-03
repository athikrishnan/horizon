import { Expense } from './expense.model';
import { Income } from './income.model';

export interface DailyBalanceReport {
  id: string;
  incomes: Income[];
  expenses: Expense[];
  totalExpense: number;
  totalIncome: number;
  balance: number;
  updatedAt: number;
  createdAt: number;
}
