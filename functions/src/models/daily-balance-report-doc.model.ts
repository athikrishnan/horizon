export interface DailyBalanceReportDoc {
  id: string;
  incomes: any[];
  expenses: any[];
  totalExpense: number;
  totalIncome: number;
  balance: number;
  updatedAt: number;
  createdAt: number;
}