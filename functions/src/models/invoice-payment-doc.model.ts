export interface InvoicePaymentDoc {
  id: string;
  invoice: any;
  amount: number;
  paidBy: any;
  recievedBy: any;
  createdAt: number;
  updatedAt: number;
}
