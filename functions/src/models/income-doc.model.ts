export interface IncomeDoc {
  id: string;
  type: string;
  other?: string;
  amount: number;
  date: any;
  dateKeywords: string[];
  comments?: string;
  createdBy: any;
  createdAt: number;
  updatedAt: number;
}
