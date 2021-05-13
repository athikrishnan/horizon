export interface TransactionDoc {
  id: string;
  type: string;
  isDebit: boolean;
  other?: string;
  amount: number;
  date: any;
  dateKeywords: string[];
  comments?: string;
  createdBy: any;
  createdAt: number;
  updatedAt: number;
}
