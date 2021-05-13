import { ReportItem } from './report-item.model';

export interface Report {
  items: ReportItem[];
  totalExpense: number;
  totalIncome: number;
  balance: number;
}
