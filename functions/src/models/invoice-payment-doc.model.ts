export interface InvoicePaymentDoc {
  id: string;
  invoice: any;
  amount: number;
  paidBy: any;
  recievedBy: any;
  date: any,
  dateKeywords: string[];
  createdAt: number;
  updatedAt: number;
}
