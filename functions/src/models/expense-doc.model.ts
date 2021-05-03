export interface ExpenseDoc {
  id: string;
  type: any;
  other?: string;
  amount: number;
  date: any;
  dateKeywords: string[];
  comments?: string;
  createdBy: any;
  createdAt: number;
  updatedAt: number;
}
