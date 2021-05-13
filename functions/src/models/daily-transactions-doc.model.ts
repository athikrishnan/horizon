export interface DailyTransactionsDoc {
  id: string;
  transactions: any[];
  totalExpense: number;
  totalIncome: number;
  balance: number;
  updatedAt: number;
  createdAt: number;
}